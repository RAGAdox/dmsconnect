import COURSES_ARRAY from "@/lib/constants/courses";
import { useClerk } from "@clerk/nextjs";
import {
  Button,
  Card,
  Heading,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const OnboardingForm = () => {
  const { session } = useClerk();
  const router = useRouter();

  const [success, setSuccess] = useState<boolean>();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const [regNum, setRegNumber] = useState<string>("");
  const [courseName, setCourseName] =
    useState<(typeof COURSES_ARRAY)[number]>();

  const isFormInValid =
    !regNum ||
    regNum.length !== 10 ||
    !courseName ||
    error !== undefined ||
    pending;

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setError(undefined);
    if (value.length <= 10) {
      setRegNumber(value);
    }
  };

  const handleCourseNameChange = (val: (typeof COURSES_ARRAY)[number]) => {
    setError(undefined);
    setCourseName(val);
  };

  const handleSubmit = async () => {
    if (!isFormInValid) {
      setPending(true);
      const body: OnboardingArgs = {
        registrationNumber: regNum,
        course: courseName,
      };
      const response = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.ok && session) {
        session.touch().then(() => setSuccess(true));
      } else {
        try {
          const data = await response.json();
          setError(data.message);
        } catch {
          setError("An error occurred");
        } finally {
          setPending(false);
        }
      }
    }
  };

  useEffect(() => {
    if (success) {
      window.location.replace("/");
      setPending(false);
    }
  }, [success, router]);

  return (
    <Card className="max-w-sm w-full mx-auto">
      <div className="flex flex-col gap-2">
        <Heading as="h4" size="4">
          Enter Registration Details
        </Heading>
        <div className="flex flex-col gap-1">
          <label>Registration Number:</label>
          <TextField.Root
            type="number"
            inputMode="numeric"
            maxLength={10}
            placeholder="Enter Registration number"
            value={regNum}
            onChange={handleRegChange}
            required
          ></TextField.Root>
        </div>
        <div className="flex flex-col gap-1">
          <label>Course Name:</label>
          <Select.Root
            value={courseName}
            onValueChange={handleCourseNameChange}
            required
          >
            <Select.Trigger placeholder="Select a Course" />
            <Select.Content>
              {COURSES_ARRAY.map((value) => (
                <Select.Item key={value} value={value}>
                  {value}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        <Text as="p" size="2" align="right" color="red">
          {error ?? <>&nbsp;</>}
        </Text>

        <div className="flex flex-row flex-1 gap-2 justify-end">
          <Button type="reset" variant="surface">
            Cancel
          </Button>
          <Button
            loading={pending}
            type="submit"
            disabled={isFormInValid}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default OnboardingForm;
