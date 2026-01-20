import prisma from "../config/db.js";

export const createBooking = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const userId = req.user.userId;

    if (!serviceId) {
      return res.status(400).json({ message: "Service ID required" });
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user.credits < service.creditCost) {
      return res.status(400).json({ message: "Insufficient credits" });
    }

    // Deduct credits
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: service.creditCost } },
    });

    const booking = await prisma.booking.create({
  data: {
    customerId: userId,
    serviceId: service.id,
  },
});

await assignProvider(booking.id);

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
};

export const assignProvider = async (bookingId) => {
  const provider = await prisma.user.findFirst({
    where: { role: "PROVIDER" },
  });

  if (!provider) return null;

  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      providerId: provider.id,
      status: "ASSIGNED",
    },
  });
};

