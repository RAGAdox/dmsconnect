const STORAGE_CONFIG = {
  BUCKET_ID: process.env.STORAGE_BUCKET_ID!.trim(),
  ALLOWED_FILE_TYPES: process.env.STORAGE_BUCKET_ALLOWED_FILE_TYPES!.trim(),
} as const;

export default STORAGE_CONFIG;
