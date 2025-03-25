import STORAGE_CONFIG from "@/lib/config/storageConfig";
import { t } from "@/lib/constants";
import COURSES_ARRAY from "@/lib/constants/courses";
import SUBJECT_CODE_ARRAY from "@/lib/constants/subject";
import { Button, Card, Heading, Select, Text } from "@radix-ui/themes";

import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useEffect, useState } from "react";

const FileShare = ({
  allowedFileTypes,
  courses,
  subjectCode,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [course, setCourse] = useState<(typeof courses)[number]>();
  const [subject, setSubject] = useState<(typeof subjectCode)[number]>();
  const [isDragging, setIsDragging] = useState(false);

  const [message, setMessage] = useState<{ success: boolean; text: string }>();

  const isFormInValid = !file || !course || !subject;

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Necessary to allow dropping
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length === 1) {
      setFile(droppedFiles[0]);
    } else {
      // Show some alerts
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setMessage(undefined);
      setFile(event.target.files[0]);
    }
  };

  const handleCourseChange = (value: string) => {
    setMessage(undefined);
    setCourse(value as typeof course);
  };

  const handleSubjectCodeChange = (value: string) => {
    setMessage(undefined);
    setSubject(value as typeof subject);
  };

  const handleUpload = async () => {
    if (!isFormInValid) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("subjectCode", subject);
      formData.append("course", course);
      setUploading(true);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setMessage({ success: true, text: "File successfully uploaded" });
      } else {
        try {
          const data = await response.json();
          setMessage({ success: false, text: data.message });
        } catch {
          setMessage({ success: false, text: "Unable to upload" });
        }
      }
      setUploading(false);
    }
  };

  useEffect(() => {
    if (message && message.success) {
      setCourse(undefined);
      setSubject(undefined);
      setFile(null);
    }
  }, [message]);

  return (
    <Card className="max-w-sm w-full mx-auto flex! flex-col!">
      <Heading as="h2">
        {t.flagModule.file.feature.file_upload.form.title}
      </Heading>
      <Text as="p">
        {t.flagModule.file.feature.file_upload.form.description}
      </Text>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <label>Course:</label>
          <Select.Root value={course ?? ""} onValueChange={handleCourseChange}>
            <Select.Trigger placeholder="Select Course"></Select.Trigger>
            <Select.Content>
              {courses.map((course) => (
                <Select.Item key={course} value={course}>
                  {course}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>
        <div className="flex flex-col">
          <label>Subject:</label>
          <Select.Root
            value={subject ?? ""}
            onValueChange={handleSubjectCodeChange}
          >
            <Select.Trigger placeholder="Select Subject"></Select.Trigger>
            <Select.Content>
              {subjectCode.map((code) => (
                <Select.Item key={code} value={code}>
                  {code}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>
        <div className="flex flex-col">
          <label>Select File:</label>
          <label htmlFor="fileUpload">
            <Card
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                id="fileUpload"
                type="file"
                accept={allowedFileTypes}
                multiple={false}
                className="hidden"
                onChange={handleFileChange}
              />

              <Text truncate>
                {file
                  ? file.name
                  : isDragging
                  ? "Drop Here"
                  : "Choose a File / Drag and Drop a File"}
              </Text>
            </Card>
          </label>
        </div>
        <Text
          as="p"
          size="2"
          align="right"
          color={message && message.success ? "green" : "red"}
        >
          {message ? message.text : <>&nbsp;</>}
        </Text>
        <div className="flex flex-row flex-1 gap-2 justify-end">
          <Button
            loading={uploading}
            disabled={isFormInValid || uploading}
            onClick={handleUpload}
            type="submit"
          >
            Upload
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const getStaticProps = (() => {
  return {
    props: {
      allowedFileTypes: STORAGE_CONFIG.ALLOWED_FILE_TYPES,
      courses: COURSES_ARRAY,
      subjectCode: SUBJECT_CODE_ARRAY,
    },
  };
}) satisfies GetStaticProps<{
  allowedFileTypes: string;
  courses: typeof COURSES_ARRAY;
  subjectCode: typeof SUBJECT_CODE_ARRAY;
}>;

export default FileShare;
