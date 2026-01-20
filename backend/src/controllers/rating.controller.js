import prisma from "../config/db.js";

export const addRating = async (req, res) => {
  const { bookingId, rating, review } = req.body;
  const customerId = req.user.userId;

  if (!bookingId || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Invalid rating data" });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.status !== "COMPLETED") {
    return res.status(400).json({ message: "Booking not completed" });
  }

  const newRating = await prisma.rating.create({
    data: {
      bookingId,
      customerId,
      providerId: booking.providerId,
      rating,
      review,
    },
  });

  // Recalculate provider average rating
  const ratings = await prisma.rating.findMany({
    where: { providerId: booking.providerId },
  });

  const avg =
    ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

  await prisma.user.update({
    where: { id: booking.providerId },
    data: { },
  });

  res.status(201).json(newRating);
};
