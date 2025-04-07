const EMAIL_DOMAINS = process.env.EMAIL_DOMAINS
  ? process.env.EMAIL_DOMAINS.trim().split(",")
  : [];

export default EMAIL_DOMAINS;
