import { Select } from "@radix-ui/themes";

const currentYear = new Date().getFullYear() + 10;
const years = Array.from({ length: 100 }, (_, i) => currentYear - i); // Last 100 years

interface YearSelectorProps {
  placeholder?: string;
  className?: string;
}

export default function YearSelector({
  placeholder,
  className,
}: YearSelectorProps) {
  // const [year, setYear] = useState<string>(currentYear.toString());

  return (
    <div className={className}>
      <Select.Root required>
        <Select.Trigger placeholder={placeholder} />
        <Select.Content>
          {years.map((y) => (
            <Select.Item key={y} value={`${y}`}>
              {y}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  );
}
