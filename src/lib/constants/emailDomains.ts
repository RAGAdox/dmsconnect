const EMAIL_DOMAINS = process.env.EMAIL_DOMAINS
  ? process.env.EMAIL_DOMAINS.split(",")
  : [];

export default EMAIL_DOMAINS;
