import prisma from "../config/db.js";
import { logBookingEvent } from "../services/bookingEvent.service.js";

export const getAssignedBookings = async (req, res) => {
  try {
    const providerId = req.user.userId;

    const bookings = await prisma.booking.findMany({
      where: {
        providerId,
      },
      include: {
        service: true,
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(bookings);
  } catch (err) {
    console.error("Get assigned bookings error:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

export const acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const providerId = req.user.userId;

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.providerId !== providerId) {
      return res.status(403).json({ message: "Not authorized to accept this booking" });
    }

    if (booking.status !== "ASSIGNED") {
      return res.status(400).json({ message: "Cannot accept booking in current status" });
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "IN_PROGRESS" },
    });

    // Log event
    await logBookingEvent({
      bookingId,
      fromStatus: "ASSIGNED",
      toStatus: "IN_PROGRESS",
      actor: "PROVIDER",
    });

    res.json(updated);
  } catch (err) {
    console.error("Accept booking error:", err);
    res.status(500).json({ message: "Failed to accept booking" });
  }
};

export const rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const providerId = req.user.userId;

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.providerId !== providerId) {
      return res.status(403).json({ message: "Not authorized to reject this booking" });
    }

    if (booking.status !== "ASSIGNED") {
      return res.status(400).json({ message: "Cannot reject booking in current status" });
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        providerId: null,
        status: "PENDING",
      },
    });

    // Log event
    await logBookingEvent({
      bookingId,
      fromStatus: "ASSIGNED",
      toStatus: "PENDING",
      actor: "PROVIDER",
    });

    res.json({ message: "Booking rejected" });
  } catch (err) {
    console.error("Reject booking error:", err);
    res.status(500).json({ message: "Failed to reject booking" });
  }
};
