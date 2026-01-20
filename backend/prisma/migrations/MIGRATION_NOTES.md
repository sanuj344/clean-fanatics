# Database Migration Notes

## Required Migration

The schema has been updated with the following changes:

1. **Service Model**: Added `providerId` field (required, foreign key to User)
2. **Booking Model**: Added address fields:
   - `houseNumber` (String, required)
   - `landmark` (String, optional)
   - `addressLabel` (AddressLabel enum: HOME | OTHER, required)
   - `phone` (String, required)

## To Apply Migration

Run the following command in the backend directory:

```bash
npx prisma migrate dev --name add_provider_services_and_booking_address
```

This will:
- Create a new migration
- Apply it to your database
- Regenerate Prisma Client

## Important Notes

- **Existing services**: If you have existing services without providerId, you'll need to either:
  - Delete them (recommended for fresh start)
  - Or assign them to a provider manually
  
- **Existing bookings**: If you have existing bookings, you'll need to provide default values for the new required fields or delete them.

## For Fresh Database

If starting fresh, you can simply run:
```bash
npx prisma migrate reset
```

This will drop the database, recreate it, and apply all migrations.
