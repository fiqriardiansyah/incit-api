/*
  Warnings:

  - You are about to drop the column `accessToken` on the `oauthtoken` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `oauthtoken` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `oauthtoken` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user` table. All the data in the column will be lost.
  - Added the required column `accesstoken` to the `oauthtoken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userid` to the `oauthtoken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstname` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedat` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "oauthtoken" DROP CONSTRAINT "oauthtoken_userId_fkey";

-- AlterTable
ALTER TABLE "oauthtoken" DROP COLUMN "accessToken",
DROP COLUMN "createdAt",
DROP COLUMN "userId",
ADD COLUMN     "accesstoken" TEXT NOT NULL,
ADD COLUMN     "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "createdAt",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "updatedAt",
ADD COLUMN     "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstname" TEXT NOT NULL,
ADD COLUMN     "lastame" TEXT,
ADD COLUMN     "updatedat" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "oauthtoken" ADD CONSTRAINT "oauthtoken_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
