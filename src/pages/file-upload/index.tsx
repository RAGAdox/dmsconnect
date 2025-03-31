import { triggerToast } from "@/components/TriggerToast";
import STORAGE_CONFIG from "@/config/storageConfig";
import { t } from "@/constants";
import courseMapper from "@/utils/mappers/courseMapper";
import subjectMapper from "@/utils/mappers/subjectMapper";

import toBoolean from "@/utils/toBoolean";
import { $Enums } from "@prisma/client";
import { Button, Card, Heading, Select, Text } from "@radix-ui/themes";

import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

const FileShare = ({
  allowedFileTypes,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const COURSE_PARAM = "course";
  const SUBJECT_PARAM = "subjectCode";
  const router = useRouter();

  const searchParams = useMemo(
    () => new URLSearchParams(router.asPath.split("?")[1]),
    [router.asPath]
  );

  const shouldRedirect = toBoolean(searchParams.get("redirect") || undefined);

  const course = courseMapper
    .getCourseKeys()
    .includes(searchParams.get(COURSE_PARAM) as $Enums.course)
    ? (searchParams.get(COURSE_PARAM) as $Enums.course)
    : undefined;

  const subject = subjectMapper
    .getSubjectKeys()
    .includes(searchParams.get(SUBJECT_PARAM) as $Enums.subject_code)
    ? (searchParams.get(SUBJECT_PARAM) as $Enums.subject_code)
    : undefined;

  const getSearchParams = (
    params: URLSearchParams,
    currentCourse: $Enums.course | undefined,
    currentSubject: $Enums.subject_code | undefined,
    clean?: boolean
  ) => {
    if (clean) {
      params = new URLSearchParams();
    }
    params.set(COURSE_PARAM, currentCourse || "");
    params.set(SUBJECT_PARAM, currentSubject || "");
    return `?${params.toString()}`;
  };

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
        triggerToast("File successfully updated", true);
      } else {
        try {
          const data = await response.json();
          setMessage({ success: false, text: data.message });
          triggerToast(data.message, false);
        } catch {
          setMessage({ success: false, text: "Unable to upload" });
          triggerToast("Unable to upload", false);
        }
      }
      setUploading(false);
    }
  };

  useEffect(() => {
    if (message && message.success) {
      setFile(null);
      if (shouldRedirect) {
        setTimeout(() => {
          window.location.href = `/files${getSearchParams(
            searchParams,
            course,
            subject,
            true
          )}`;
        }, 1000);
      } else {
        router.push(getSearchParams(searchParams, undefined, undefined, true));
      }
      setMessage(undefined);
    }
  }, [course, message, router, searchParams, shouldRedirect, subject]);

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
          <Select.Root
            value={course ?? ""}
            onValueChange={(selectedCourse: $Enums.course) => {
              router.replace(
                getSearchParams(searchParams, selectedCourse, subject)
              );
            }}
          >
            <Select.Trigger placeholder="Select Course"></Select.Trigger>
            <Select.Content>
              {courseMapper.getCourseKeys().map((courseEnumkey) => {
                return (
                  <Select.Item value={courseEnumkey} key={courseEnumkey}>
                    {courseMapper.getCourseName(courseEnumkey)}
                  </Select.Item>
                );
              })}
            </Select.Content>
          </Select.Root>
        </div>
        <div className="flex flex-col">
          <label>Subject:</label>
          <Select.Root
            value={subject ?? ""}
            onValueChange={(selectedSubject) =>
              router.replace(
                getSearchParams(
                  searchParams,
                  course,
                  selectedSubject as $Enums.subject_code
                )
              )
            }
          >
            <Select.Trigger placeholder="Select Subject"></Select.Trigger>
            <Select.Content>
              {subjectMapper.getSubjectKeys().map((subjectKey) => (
                <Select.Item key={subjectKey} value={subjectKey}>
                  {subjectMapper.getSubjectName(subjectKey)}
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
    },
  };
}) satisfies GetStaticProps<{
  allowedFileTypes: string;
}>;

export default FileShare;
