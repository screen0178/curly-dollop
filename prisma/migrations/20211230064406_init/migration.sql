/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE "company_id_seq";
ALTER TABLE "Company" ALTER COLUMN "id" SET DEFAULT nextval('company_id_seq');
ALTER SEQUENCE "company_id_seq" OWNED BY "Company"."id";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL;
