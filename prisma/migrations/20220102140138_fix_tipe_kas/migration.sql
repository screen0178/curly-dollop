/*
  Warnings:

  - Changed the type of `tipe_kas` on the `Arus_kas` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Arus_kas" DROP COLUMN "tipe_kas",
ADD COLUMN     "tipe_kas" "Tipe_kas" NOT NULL;
