import getFileRecord from "@/services/getFileRecord";
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
import { useRouter } from "next/router";
import { useEffect } from "react";

interface Props {
  files: IFRecords;
}

const FileExplorer = ({
  files,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const COURSE_PARAM = "course";
  const SUBJECT_PARAM = "subjectCode";
  const router = useRouter();
  const searchParams = new URLSearchParams(router.asPath.split("?").pop());

  const urlCourse = Object.keys(files).includes(
    searchParams.get(COURSE_PARAM) as keyof IFRecords
  )
    ? (searchParams.get(COURSE_PARAM) as keyof IFRecords)
    : undefined;
  const currentCourse = urlCourse ?? (Object.keys(files)[0] as keyof IFRecords);

  const urlSubject = Object.keys(files[currentCourse]).includes(
    searchParams.get(SUBJECT_PARAM) as keyof IFSubjectRecords
  )
    ? (searchParams.get(SUBJECT_PARAM) as keyof IFSubjectRecords)
    : undefined;

  const currentSubjectCode =
    urlSubject ??
    (Object.keys(files[currentCourse])[0] as keyof IFSubjectRecords);

  useEffect(() => {
    if (!urlSubject || !urlSubject) {
      router.replace(
        `?course=${encodeURIComponent(
          currentCourse
        )}&subjectCode=${encodeURIComponent(currentSubjectCode)}`
      );
    }
  }, [currentCourse, currentSubjectCode, router, urlSubject]);

  return (
    <div className="flex-1 flex">
      <Tabs.Root
        value={currentCourse}
        // onValueChange={handleCourseChange}
        className="flex flex-col flex-1"
      >
        <Tabs.List className="flex">
          {Object.keys(files).map((course) => (
            <Link
              key={course}
              tabIndex={-1}
              href={`?course=${encodeURIComponent(
                course
              )}&subjectCode=${encodeURIComponent(currentSubjectCode)}`}
            >
              <Tabs.Trigger value={course}>{course}</Tabs.Trigger>
            </Link>
          ))}
        </Tabs.List>
        <div className="flex-1 flex flex-row">
          <div className="flex-1/3 md:flex-1/4 flex flex-col min-h-full gap-2 p-2">
            {Object.keys(files[currentCourse]).map((subjectCode) => (
              <RadixLink
                weight={currentSubjectCode === subjectCode ? "bold" : "regular"}
                key={subjectCode}
                asChild
              >
                <Link
                  href={`?course=${encodeURIComponent(
                    currentCourse
                  )}&subjectCode=${encodeURIComponent(subjectCode)}`}
                >
                  {subjectCode}
                </Link>
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
                          <RadixLink
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
                          </RadixLink>
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
    return {
      notFound: true,
    };
  }
  return {
    props: { files },
  };
}) satisfies GetStaticProps<Props>;
export default FileExplorer;
