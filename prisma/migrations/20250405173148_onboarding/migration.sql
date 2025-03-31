-- CreateTable
CREATE TABLE "onboarding" (
    "course" "course" NOT NULL,
    "reg_number" VARCHAR(10) NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "emailAddress" VARCHAR NOT NULL,
    "startYear" SMALLINT NOT NULL,
    "endYear" SMALLINT NOT NULL,

    CONSTRAINT "onboarding_pkey" PRIMARY KEY ("emailAddress")
);

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_reg_number_key" ON "onboarding"("reg_number");

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_user_id_key" ON "onboarding"("user_id");
