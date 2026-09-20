/*
  Safe Migration: volunteer_password_login
  
  Changes:
    1. Drop firebaseUid unique index
    2. Drop firebaseUid column
    3. Add password column as nullable (safe for existing rows)
    4. Set a bcrypt placeholder hash on all existing rows
       (cost 12, value = "MUST_CHANGE_PASSWORD")
       Admin MUST reset passwords for existing volunteers before they can log in.
    5. Alter password column to NOT NULL

  Note: Existing volunteer rows will receive a placeholder bcrypt hash.
  Their passwords MUST be reset by Admin via PATCH /api/volunteers/:id
  before they can log in with the new Mobile+Password authentication.
*/

-- Step 1: Drop firebaseUid unique index
DROP INDEX "Volunteer_firebaseUid_key";

-- Step 2: Drop firebaseUid column
ALTER TABLE "Volunteer" DROP COLUMN "firebaseUid";

-- Step 3: Add password as nullable first (safe for existing rows)
ALTER TABLE "Volunteer" ADD COLUMN "password" TEXT;

-- Step 4: Set placeholder bcrypt hash on ALL existing rows
-- Hash is bcrypt cost-12 of "MUST_CHANGE_PASSWORD"
-- Admin must set real passwords via PATCH /api/volunteers/:id
UPDATE "Volunteer"
SET "password" = '$2b$12$38j5/Rki3E8NEVAfGDuhu.BIbVGVSLNbDsFwna6VVb/tv.vVB1o6m'
WHERE "password" IS NULL;

-- Step 5: Add NOT NULL constraint now that all rows have a value
ALTER TABLE "Volunteer" ALTER COLUMN "password" SET NOT NULL;
