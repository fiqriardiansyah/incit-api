-- AlterTable
ALTER TABLE "user" ADD COLUMN     "verificationtoken" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
