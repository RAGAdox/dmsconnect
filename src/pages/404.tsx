import { Link as RadixLink, Text } from "@radix-ui/themes";
import Link from "next/link";
const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <Text as="p" weight="bold" size="6">
        404 | Not Found
      </Text>

      <RadixLink weight="bold" size="4" className=" underline" asChild>
        <Link href="/">Return to Home</Link>
      </RadixLink>
    </div>
  );
};

export default NotFound;
