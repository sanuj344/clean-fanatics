import prisma from "../config/db.js";

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        service: true,
        customer: true,
        provider: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(bookings);
  } catch (err) {
    console.error("Get all bookings error:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

export const overrideBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  res.json(booking);
};
