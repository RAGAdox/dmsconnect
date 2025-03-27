import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Callout } from "@radix-ui/themes";
import { toast } from "react-toastify";

const triggerToast = (message: string, success: boolean) =>
  toast(
    () => (
      <Callout.Root variant="soft" color={success ? "green" : "red"}>
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>{message}</Callout.Text>
      </Callout.Root>
    ),
    {
      className: "p-0! flex-1! min-h-[unset]! rounded-(--radius-4)! w-[unset]!",
      autoClose: 1000,
    }
  );

export default triggerToast;
