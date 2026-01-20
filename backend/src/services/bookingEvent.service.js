import prisma from "../config/db.js";

export const logBookingEvent = async ({
  bookingId,
  fromStatus,
  toStatus,
  actor,
}) => {
  return prisma.bookingEvent.create({
    data: {
      bookingId,
      fromStatus,
      toStatus,
      actor,
    },
  });
};
