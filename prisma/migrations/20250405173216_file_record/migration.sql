-- CreateTable
CREATE TABLE "file_record" (
    "owner_email" VARCHAR NOT NULL,
    "course" "course" NOT NULL,
    "subject_code" "subject_code" NOT NULL,
    "file_name" VARCHAR NOT NULL,
    "file_id" UUID NOT NULL,

    CONSTRAINT "file_record_pkey" PRIMARY KEY ("file_id")
);

-- AddForeignKey
ALTER TABLE "file_record" ADD CONSTRAINT "file_record_owner_email_fkey" FOREIGN KEY ("owner_email") REFERENCES "onboarding"("emailAddress") ON DELETE CASCADE ON UPDATE CASCADE;
