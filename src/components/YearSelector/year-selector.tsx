import { Select } from "@radix-ui/themes";
import { noop } from "lodash";

interface YearSelectorProps {
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  values: number[];
  value?: number;
  setValue?: (v: number) => void;
}

export default function YearSelector({
  placeholder,
  className,
  value,
  values,
  disabled,
  setValue = noop,
}: YearSelectorProps) {
  return (
    <div className={className}>
      <Select.Root
        required
        disabled={disabled}
        value={value?.toString()}
        onValueChange={(y) => setValue(parseInt(y))}
      >
        <Select.Trigger placeholder={placeholder} />
        <Select.Content>
          {values.map((y) => (
            <Select.Item key={y} value={y.toString()}>
              {y.toString()}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  );
}
