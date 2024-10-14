-- AlterTable
ALTER TABLE "user" ADD COLUMN     "countlogin" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "logoutat" TIMESTAMP(3);
