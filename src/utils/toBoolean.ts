export default function toBoolean(value?: string): boolean {
  return value ? value.trim().toLowerCase() === "true" : false;
}
