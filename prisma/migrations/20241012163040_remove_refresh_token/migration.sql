/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `oauthtoken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "oauthtoken" DROP COLUMN "refreshToken";
