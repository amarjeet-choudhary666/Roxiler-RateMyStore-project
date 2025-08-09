-- AlterTable
ALTER TABLE "public"."stores" ADD COLUMN     "refreshToken" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "refreshToken" TEXT;
