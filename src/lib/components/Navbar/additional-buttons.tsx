import { UpdateIcon, UploadIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/router";

const AdditionalButtons = () => {
  const router = useRouter();
  if (router.pathname.startsWith("/files")) {
    const searchParams = new URLSearchParams(router.asPath.split("?").pop());
    searchParams.set("redirect", "true");
    return (
      <>
        <Link href={`/file-upload?${searchParams}`} tabIndex={-1}>
          <IconButton size="2" variant="outline">
            <UploadIcon />
          </IconButton>
        </Link>
        <IconButton size="2" variant="outline" onClick={() => router.reload()}>
          <UpdateIcon />
        </IconButton>
      </>
    );
  }
};

export default AdditionalButtons;
