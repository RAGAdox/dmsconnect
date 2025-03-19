import { t } from "@/lib/constants";
import { Button, Card, Heading, Text } from "@radix-ui/themes";
import { useState } from "react";

const FileShare = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setUploading(false);

    if (data.fileUrl) {
      setFileUrl(data.fileUrl);
    } else {
      alert("Upload failed!");
    }
  };

  return (
    <Card>
      <Heading as="h2">
        {t.flagModule.file.feature.file_upload.form.title}
      </Heading>
      <Text as="p">
        {t.flagModule.file.feature.file_upload.form.description}
      </Text>
      <input
        id="fileUpload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button asChild>
        <label htmlFor="fileUpload">{file ? file.name : "Choose a File"}</label>
      </Button>
      <Button onClick={handleUpload} type="submit">
        {uploading ? "Uploading..." : "Upload"}
      </Button>
      {fileUrl && (
        <p className="text-sm">
          Uploaded File:{" "}
          <a href={fileUrl} target="_blank" className="text-blue-500">
            {fileUrl}
          </a>
        </p>
      )}
    </Card>
  );
};

export default FileShare;
