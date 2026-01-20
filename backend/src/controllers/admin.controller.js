import prisma from "../config/db.js";

export const overrideBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  res.json(booking);
};
