/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `User_token` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_token_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_token_token_key" ON "User_token"("token");
