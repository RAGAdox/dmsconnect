import COURSES_ARRAY from "@/lib/constants/courses";
import getFeatureFlags from "@/lib/utils/getFeatureFlags";
import isAllowedEmailDomain from "@/lib/utils/isAllowedEmailDomain";
import { useClerk } from "@clerk/nextjs";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import {
  Button,
  Card,
  Heading,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { useState } from "react";

const Onboarding = () => {
  const router = useRouter();
  const { session } = useClerk();

  const [error, setError] = useState<string>();
  const [regNum, setRegNumber] = useState<string>("");
  const [courseName, setCourseName] =
    useState<(typeof COURSES_ARRAY)[number]>();

  const isFormInValid =
    !regNum || regNum.length !== 10 || !courseName || error !== undefined;
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
      const body: OnboardingArgs = {
        registrationNumber: regNum,
        course: courseName,
      };
      const response = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // ✅ Add this line
        body: JSON.stringify(body),
      });
      if (response.ok) {
        session!.reload();
        router.replace("/");
      } else {
        console.log(response);
        try {
          const data = await response.json();
          console.log(data);
          setError(data.message);
        } catch {
          setError("An error occurred"); // ✅ Add this line
        }
      }
    }
  };

  return (
    <Card className="max-w-sm w-full mx-auto">
      <div className="flex flex-col gap-2">
        <Heading as="h4" size="4">
          Enter Registration Details
        </Heading>
        <div className="flex flex-col">
          <label>
            Registration Number:
            <TextField.Root
              type="number"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter Registration number"
              value={regNum}
              onChange={handleRegChange}
              required
            ></TextField.Root>
          </label>
        </div>
        <div className="flex flex-col">
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
        {error && (
          <Text size="2" align="right" color="red">
            {error}
          </Text>
        )}
        <div className="flex flex-row flex-1 gap-2 justify-end">
          <Button type="reset" variant="surface">
            Cancel
          </Button>
          <Button type="submit" disabled={isFormInValid} onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
      <div></div>
    </Card>
  );
};

export const getServerSideProps = (async ({ req }) => {
  const { userId } = getAuth(req);
  const featureFlages = await getFeatureFlags();
  if (featureFlages.check_email_domains) {
    if (userId) {
      const client = await clerkClient();
      const { emailAddresses } = await client.users.getUser(userId);

      const isEmailAllowed = isAllowedEmailDomain(emailAddresses);
      if (!isEmailAllowed) {
        return {
          redirect: {
            destination: "/onboarding/banned",
            permanent: false,
          },
        };
      }
    }
  }
  return { props: {} };
}) satisfies GetServerSideProps;

export default Onboarding;
