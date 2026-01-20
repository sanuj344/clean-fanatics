import prisma from "../config/db.js";
import { logBookingEvent } from "../services/bookingEvent.service.js";

/**
 * CUSTOMER → Create booking
 */
export const createBooking = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const userId = req.user.userId;

    if (!serviceId) {
      return res.status(400).json({ message: "Service ID required" });
    }

    // Fetch service
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Fetch customer
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user.credits < service.creditCost) {
      return res.status(400).json({ message: "Insufficient credits" });
    }

    // Deduct credits
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { decrement: service.creditCost },
      },
    });

    // Create booking (initially PENDING)
    const booking = await prisma.booking.create({
      data: {
        customerId: userId,
        serviceId: service.id,
        status: "PENDING",
      },
    });

    // Log booking created event
    await logBookingEvent({
      bookingId: booking.id,
      fromStatus: null,
      toStatus: "PENDING",
      actor: "CUSTOMER",
    });

    // Auto-assign provider
    await assignProvider(booking.id);

    return res.status(201).json(booking);
  } catch (err) {
    console.error("Create booking error:", err);
    return res.status(500).json({ message: "Booking failed" });
  }
};

/**
 * SYSTEM → Auto-assign provider
 */
export const assignProvider = async (bookingId) => {
  const provider = await prisma.user.findFirst({
    where: { role: "PROVIDER" },
  });

  if (!provider) return null;

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      providerId: provider.id,
      status: "ASSIGNED",
    },
  });

  // Log assignment event
  await logBookingEvent({
    bookingId,
    fromStatus: "PENDING",
    toStatus: "ASSIGNED",
    actor: "SYSTEM",
  });

  return updatedBooking;
};

/**
 * GET booking + event history (observability)
 */
export const getBookingWithEvents = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: true,
        customer: true,
        provider: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const events = await prisma.bookingEvent.findMany({
      where: { bookingId },
      orderBy: { createdAt: "asc" },
    });

    return res.json({ booking, events });
  } catch (err) {
    console.error("Fetch booking error:", err);
    return res.status(500).json({ message: "Failed to fetch booking" });
  }
};
