-- AlterTable
ALTER TABLE "Voter" ADD COLUMN     "assemblyNumber" TEXT,
ADD COLUMN     "dateOfBirth" TEXT,
ADD COLUMN     "fatherNameHindi" TEXT,
ADD COLUMN     "nameHindi" TEXT,
ADD COLUMN     "partNumber" TEXT,
ADD COLUMN     "partSerial" TEXT,
ADD COLUMN     "pollingStationName" TEXT;

-- CreateIndex
CREATE INDEX "Voter_partNumber_idx" ON "Voter"("partNumber");
