import prisma from "../config/db.js";

export const getAssignedBookings = async (req, res) => {
  const providerId = req.user.userId;

  const bookings = await prisma.booking.findMany({
    where: {
      providerId,
      status: "ASSIGNED",
    },
    include: {
      service: true,
      customer: true,
    },
  });

  res.json(bookings);
};


export const acceptBooking = async (req, res) => {
  const { bookingId } = req.params;

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

  if (!booking || booking.status !== "ASSIGNED") {
    return res.status(400).json({ message: "Cannot accept booking" });
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "IN_PROGRESS" },
  });

  res.json(updated);
};

export const rejectBooking = async (req, res) => {
  const { bookingId } = req.params;

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

  if (!booking || booking.status !== "ASSIGNED") {
    return res.status(400).json({ message: "Cannot reject booking" });
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      providerId: null,
      status: "PENDING",
    },
  });

  res.json({ message: "Booking rejected, retrying assignment" });
};
