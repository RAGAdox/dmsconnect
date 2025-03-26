import getFileRecord from "@/lib/utils/getFileRecord";
import {
  Avatar,
  ContextMenu,
  Link as RadixLink,
  ScrollArea,
  Separator,
  Tabs,
  Text,
} from "@radix-ui/themes";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useState } from "react";

interface Props {
  files: IFRecords;
}

const FileExplorer = ({
  files,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const initCourse = Object.keys(files)[0] as keyof IFRecords;
  const [currentCourse, setCurrentCourse] =
    useState<keyof IFRecords>(initCourse);

  const initSubjectCode = Object.keys(
    files[currentCourse]
  )[0] as keyof IFSubjectRecords;
  const [currentSubjectCode, setCurrentSubjectCode] =
    useState<keyof IFSubjectRecords>(initSubjectCode);

  const handleCourseChange = (value: string) => {
    const initSubjectCode = Object.keys(
      files[value as keyof IFRecords]
    )[0] as keyof IFSubjectRecords;
    setCurrentSubjectCode(initSubjectCode);
    setCurrentCourse(value as keyof IFRecords);
  };

  const handleSubjectCodeChange = (value: string) => {
    setCurrentSubjectCode(value as keyof IFSubjectRecords);
  };

  return (
    <div className="flex-1 flex">
      <Tabs.Root
        value={currentCourse}
        onValueChange={handleCourseChange}
        className="flex flex-col flex-1"
      >
        <Tabs.List className="flex">
          {Object.keys(files).map((course) => (
            <Tabs.Trigger key={course} value={course}>
              <Text>{course}</Text>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <div className="flex-1 flex flex-row">
          <div className="flex-1/3 md:flex-1/4 flex flex-col min-h-full gap-2 p-2">
            {Object.keys(files[currentCourse]).map((subjectCode) => (
              <RadixLink
                weight={currentSubjectCode === subjectCode ? "bold" : "regular"}
                key={subjectCode}
                onClick={() => handleSubjectCodeChange(subjectCode)}
              >
                {subjectCode}
              </RadixLink>
            ))}
          </div>
          <Separator orientation="vertical" className="min-h-full" />
          <ScrollArea
            scrollbars="vertical"
            type="auto"
            style={{ maxHeight: "calc(100svh - 160px)" }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 justify-items-center gap-2 p-2">
              {files[currentCourse][currentSubjectCode] &&
                Array.isArray(files[currentCourse][currentSubjectCode]) &&
                (files[currentCourse][currentSubjectCode] as IFFiles[]).map(
                  (file) => {
                    const downloadParams = new URLSearchParams();
                    downloadParams.set("course", currentCourse);
                    downloadParams.set("subject", currentSubjectCode);
                    downloadParams.set("fileName", file.fileName);
                    return (
                      <ContextMenu.Root
                        key={`${currentCourse}-${currentSubjectCode}-${file.fileName}`}
                      >
                        <ContextMenu.Trigger>
                          <a
                            href={`/api/download?${downloadParams.toString()}`}
                            target="_blank"
                            download={file.fileName}
                            rel="noopener noreferrer"
                          >
                            <div className="flex flex-col max-w-20">
                              <Avatar
                                size="6"
                                radius="large"
                                fallback={
                                  file.fileName.split(".").pop() || "Unknown"
                                }
                              />
                              <Text align="center" truncate>
                                {file.fileName}
                              </Text>
                            </div>
                          </a>
                        </ContextMenu.Trigger>
                        <ContextMenu.Content>
                          <ContextMenu.Item>
                            <Link
                              href={`/api/download?${downloadParams.toString()}`}
                              target="_blank"
                              download={file.fileName}
                              rel="noopener noreferrer"
                            >
                              Download
                            </Link>
                          </ContextMenu.Item>
                        </ContextMenu.Content>
                      </ContextMenu.Root>
                    );
                  }
                )}
            </div>
          </ScrollArea>
        </div>
      </Tabs.Root>
    </div>
  );
};
export const getStaticProps = (async (_context) => {
  const files = await getFileRecord();
  if (!files) {
    throw new Error("Unable to Get Files");
  }

  return {
    revalidate: 3600,
    props: { files },
  };
}) satisfies GetStaticProps<Props>;
export default FileExplorer;
