/*
  Warnings:

  - You are about to drop the column `lastame` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "lastame",
ADD COLUMN     "lastname" TEXT;
