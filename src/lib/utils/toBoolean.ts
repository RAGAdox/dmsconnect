export default function toBoolean(value?: string): boolean {
  return value ? value.toLowerCase() === "true" : false;
}
