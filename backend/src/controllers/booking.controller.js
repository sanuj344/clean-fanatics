import prisma from "../config/db.js";
import { logBookingEvent } from "../services/bookingEvent.service.js";

/**
 * CUSTOMER → Create booking
 */
export const createBooking = async (req, res) => {
  try {
    const { serviceId, address, phone } = req.body;
    const userId = req.user.userId;

    if (!serviceId) {
      return res.status(400).json({ message: "Service ID required" });
    }

    // Validate address and phone
    if (!address || !address.houseNumber || !address.label) {
      return res.status(400).json({ message: "Address details required" });
    }

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // Fetch service with provider
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        provider: true,
      },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (!service.providerId) {
      return res.status(400).json({ message: "Service has no provider assigned" });
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

    // Create booking with address and phone, assign to service owner
    const booking = await prisma.booking.create({
      data: {
        customerId: userId,
        serviceId: service.id,
        providerId: service.providerId, // Assign to service owner
        status: "ASSIGNED", // Directly assign to service owner
        houseNumber: address.houseNumber,
        landmark: address.landmark || null,
        addressLabel: address.label,
        phone: phone,
      },
    });

    // Log booking created event
    await logBookingEvent({
      bookingId: booking.id,
      fromStatus: null,
      toStatus: "PENDING",
      actor: "CUSTOMER",
    });

    // Log assignment event (directly assigned to service owner)
    await logBookingEvent({
      bookingId: booking.id,
      fromStatus: "PENDING",
      toStatus: "ASSIGNED",
      actor: "SYSTEM",
    });

    return res.status(201).json(booking);
  } catch (err) {
    console.error("Create booking error:", err);
    return res.status(500).json({ message: "Booking failed" });
  }
};

// Legacy function - no longer used (bookings assigned directly to service owner)
// Kept for backward compatibility if needed
export const assignProvider = async (bookingId) => {
  // This function is deprecated - bookings are now assigned directly to service owner
  return null;
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
