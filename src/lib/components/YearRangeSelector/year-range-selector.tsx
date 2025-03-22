import { YearSelector } from "../YearSelector";

interface YearRangeSelectorProps {
  startPlaceHolder?: string;
  endPlaceHolder?: string;
}

const YearRangeSelector = ({
  startPlaceHolder,
  endPlaceHolder,
}: YearRangeSelectorProps) => {
  return (
    <div className="flex flex-row gap-2">
      <YearSelector
        placeholder={startPlaceHolder}
        className="flex flex-col w-1/2"
      />

      <YearSelector
        placeholder={endPlaceHolder}
        className="flex flex-col w-1/2"
      />
    </div>
  );
};

export default YearRangeSelector;
