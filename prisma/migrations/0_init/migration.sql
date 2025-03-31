-- CreateEnum
CREATE TYPE "course" AS ENUM ('M.B.A', 'B.B.A');

-- CreateEnum
CREATE TYPE "roles" AS ENUM ('admin', 'user', 'moderator');

-- CreateEnum
CREATE TYPE "subject_code" AS ENUM ('D.S.A(301)', 'FIEM(302)', 'FINAL(304)');

-- CreateTable
CREATE TABLE "file_record" (
    "owner_email" VARCHAR NOT NULL,
    "course" "course" NOT NULL,
    "subject_code" "subject_code" NOT NULL,
    "file_name" VARCHAR NOT NULL,
    "file_id" UUID NOT NULL,

    CONSTRAINT "file_record_pkey" PRIMARY KEY ("file_id")
);

-- CreateTable
CREATE TABLE "onboarding" (
    "course" "course" NOT NULL,
    "reg_number" VARCHAR(10),
    "user_id" VARCHAR NOT NULL,
    "emailAddress" VARCHAR NOT NULL,
    "startYear" SMALLINT NOT NULL,
    "endYear" SMALLINT NOT NULL,

    CONSTRAINT "onboarding_pkey" PRIMARY KEY ("emailAddress")
);

-- CreateTable
CREATE TABLE "predefined_user_roles" (
    "roles" "roles"[],
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,

    CONSTRAINT "predefined_user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "predefined_user_roles_email_unique" ON "predefined_user_roles"("email");

-- AddForeignKey
ALTER TABLE "file_record" ADD CONSTRAINT "file_record_owner_email_onboarding_emailAddress_fk" FOREIGN KEY ("owner_email") REFERENCES "onboarding"("emailAddress") ON DELETE CASCADE ON UPDATE CASCADE;

