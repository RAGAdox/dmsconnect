import { YearSelector } from "../YearSelector";

interface YearRangeSelectorProps {
  startPlaceHolder?: string;
  startYear: number | undefined;
  setStartYear: (v: number) => void;
  endPlaceHolder?: string;
  endYear: number | undefined;
  setEndYear: (v: number) => void;
}

const getYears = (minValue?: number) => {
  if (minValue) {
    const years = Array.from({ length: 100 }, (_, i) => minValue + i);
    return years;
  }
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i); // Last 100 years
  return years;
};

const YearRangeSelector = ({
  startPlaceHolder,
  startYear,
  setStartYear,
  endPlaceHolder,
  endYear,
  setEndYear,
}: YearRangeSelectorProps) => {
  return (
    <div className="flex flex-row gap-2">
      <YearSelector
        placeholder={startPlaceHolder}
        className="flex flex-col w-1/2"
        values={getYears()}
        value={startYear}
        setValue={setStartYear}
      />

      <YearSelector
        placeholder={endPlaceHolder}
        values={getYears(startYear)}
        disabled={!startYear}
        value={endYear}
        setValue={setEndYear}
        className="flex flex-col w-1/2"
      />
    </div>
  );
};

export default YearRangeSelector;
