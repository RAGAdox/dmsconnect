import { $Enums, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCrossSchemaReferences = async () => {
  console.log("Creating cross schema references");
  await prisma.$executeRaw`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
          FROM information_schema.table_constraints
          WHERE constraint_name = 'file_storage_constraint'
            AND table_schema = 'public'
            AND table_name = 'file_record'
      ) THEN
        ALTER TABLE public.file_record 
        ADD CONSTRAINT file_storage_constraint 
        FOREIGN KEY (file_id) REFERENCES storage.objects(id) 
        ON DELETE CASCADE;
      END IF;
    END $$;
  `;
};

const seedPredefinedUsers = async () => {
  console.log("Seeding predefined_user_roles");

  // TODO: Add external source for predefined roles
  /**
   * emails and any other personal data should not be hardcoded
   * in the codebase.
   */
  const data = [
    {
      email: "rishirishi20121997@gmail.com",
      roles: [$Enums.roles.admin, $Enums.roles.moderator, $Enums.roles.user],
    },
  ];

  return await prisma.predefined_user_roles.createMany({
    data: [...data],
    skipDuplicates: true,
  });
};

/**
 * This function seeds the database with initial data.
 * It should be run after the database is created and migrated.
 * It can be run multiple times without duplicating data.
 */

async function seeder() {
  /** Currently cross referencing schema is not stable in prisma. This cross reference is used in the case of deletiion of file using supabase dashboard or ther mechanisms. For production we should implement direct S3 uploads using S3 access key and only store these data in our schema */
  // await createCrossSchemaReferences();
  await seedPredefinedUsers();
}

seeder()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
