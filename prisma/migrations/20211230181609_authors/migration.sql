-- AlterTable
ALTER TABLE "Books" ADD COLUMN     "authorsId" INTEGER;

-- CreateTable
CREATE TABLE "Authors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Authors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Books" ADD CONSTRAINT "Books_authorsId_fkey" FOREIGN KEY ("authorsId") REFERENCES "Authors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
