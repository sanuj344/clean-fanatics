import prisma from "../config/db.js";

/**
 * POST /api/ratings
 * CUSTOMER → Create rating for a completed booking
 */
export const addRating = async (req, res) => {
  try {
    const { bookingId, rating, review } = req.body;
    const customerId = req.user.userId;

    // Validation: Check required fields
    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Fetch booking with service and provider info
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: true,
        provider: true,
        rating: true, // Check if rating already exists
      },
    });

    // Validation: Booking must exist
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Security: Booking must belong to logged-in customer
    if (booking.customerId !== customerId) {
      return res.status(403).json({ message: "Forbidden: This booking does not belong to you" });
    }

    // Validation: Booking status must be COMPLETED
    if (booking.status !== "COMPLETED") {
      return res.status(400).json({ 
        message: `Cannot rate booking with status ${booking.status}. Booking must be COMPLETED.` 
      });
    }

    // Validation: Booking must NOT already have a rating
    if (booking.rating) {
      return res.status(400).json({ message: "This booking has already been rated" });
    }

    // Validation: Booking must have a provider
    if (!booking.providerId) {
      return res.status(400).json({ message: "Booking has no provider assigned" });
    }

    // Create rating
    const newRating = await prisma.rating.create({
      data: {
        bookingId,
        customerId,
        providerId: booking.providerId,
        rating,
        review: review || null,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Recalculate provider's average rating across all their services
    // Get all ratings for this provider
    const providerRatings = await prisma.rating.findMany({
      where: { providerId: booking.providerId },
    });

    const avgRating = providerRatings.length > 0
      ? providerRatings.reduce((sum, r) => sum + r.rating, 0) / providerRatings.length
      : 0;

    // Update Service.ratingAvg for the specific service
    await prisma.service.update({
      where: { id: booking.serviceId },
      data: {
        ratingAvg: parseFloat(avgRating.toFixed(2)),
      },
    });

    return res.status(201).json(newRating);
  } catch (err) {
    console.error("Add rating error:", err);
    
    // Handle unique constraint violation (bookingId already has a rating)
    if (err.code === "P2002") {
      return res.status(400).json({ message: "This booking has already been rated" });
    }

    return res.status(500).json({ message: "Failed to create rating" });
  }
};

/**
 * GET /api/ratings/booking/:bookingId
 * Get rating for a specific booking (if exists)
 */
export const getRatingByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.userId;

    // Fetch booking to verify ownership
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        rating: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Security: Only customer who owns the booking can view its rating
    if (booking.customerId !== userId) {
      return res.status(403).json({ message: "Forbidden: This booking does not belong to you" });
    }

    if (!booking.rating) {
      return res.status(404).json({ message: "No rating found for this booking" });
    }

    return res.json(booking.rating);
  } catch (err) {
    console.error("Get rating by booking error:", err);
    return res.status(500).json({ message: "Failed to fetch rating" });
  }
};
