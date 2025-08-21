"use client";

import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./render-state";
import { useConstructUrl } from "@/hooks/use-construct-url";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  fileTypeAccepted: "image" | "video";
}

export function Uploader({ onChange, value, fileTypeAccepted }: Props) {
  const fileUrl = useConstructUrl(value || "");
  const [file, setFile] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    fileType: fileTypeAccepted,
    isDeleting: false,
    key: value,
    objectUrl: value ? fileUrl : undefined,
  });

  const uploadFile = useCallback(
    async (file: File) => {
      setFile((prev) => ({
        ...prev,
        uploading: true,
        progress: 0,
      }));

      try {
        const presignedResponse = await fetch("/api/s3/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            isImage: fileTypeAccepted === "image" ? true : false,
          }),
        });

        if (!presignedResponse.ok) {
          toast.error("Failed to get the presigned URL");
          setFile((prev) => ({
            ...prev,
            uploading: false,
            progress: 0,
            error: true,
          }));

          return;
        }

        const { presignedUrl, key } = await presignedResponse.json();

        await new Promise<void>((res, rej) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentageCompleted = (event.loaded / event.total) * 100;
              setFile((prev) => ({
                ...prev,
                progress: Math.round(percentageCompleted),
              }));
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 204) {
              setFile((prev) => ({
                ...prev,
                progress: 100,
                uploading: false,
                key,
              }));
              onChange?.(key);
              toast.success("File uploaded successfully!");
              res();
            } else {
              rej(new Error(`Upload failed with status ${xhr.status}`));
            }
          };

          xhr.onerror = () => {
            rej(new Error("Upload failed due to network error."));
          };

          xhr.open("PUT", presignedUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });
      } catch (error) {
        console.error('UPLOAD FILE ERROR', error)
        toast.error("Something went wrong");
        setFile((prev) => ({
          ...prev,
          progress: 0,
          error: true,
          uploading: false,
        }));
      }
    },
    [fileTypeAccepted, onChange]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const fileState = acceptedFiles[0];

        if (file.objectUrl && !file.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(file.objectUrl);
        }

        setFile({
          file: fileState,
          uploading: false,
          progress: 0,
          objectUrl: URL.createObjectURL(fileState),
          error: false,
          id: uuid(),
          isDeleting: false,
          fileType: fileTypeAccepted,
        });
        uploadFile(fileState);
      }
    },
    [file.objectUrl, uploadFile, fileTypeAccepted]
  );

  async function handleRemoveFile() {
    if (file.isDeleting || !file.objectUrl) return;

    try {
      setFile((prev) => ({ ...prev, isDeleting: true }));

      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: file.key,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to remove file from storage");
        setFile((prev) => ({ ...prev, isDeleting: true, error: true }));
        return;
      }

      if (file.objectUrl && !file.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(file.objectUrl);
      }

      onChange?.("");

      setFile({
        file: null,
        uploading: false,
        progress: 0,
        objectUrl: undefined,
        error: false,
        fileType: fileTypeAccepted,
        id: null,
        isDeleting: false,
      });

      toast.success("File remove successfully");
    } catch (error) {
      console.error('REMOVE FILE ERROR', error)
      toast.error("Error removing file. Please try again");
      setFile((prev) => ({
        ...prev,
        isDeleting: true,
        error: true,
      }));
    }
  }

  function onDropRejected(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );

      const fileSizeToBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );

      if (fileSizeToBig) {
        toast.error("File size exceeds the limit");
      }

      if (tooManyFiles) {
        toast.error("Too many files selected, max is 1");
      }
    }
  }

  function renderContent() {
    if (file.uploading) {
      return (
        <RenderUploadingState
          file={file.file as File}
          progress={file.progress}
        />
      );
    }

    if (file.error) {
      return <RenderErrorState />;
    }

    if (file.objectUrl) {
      return (
        <RenderUploadedState
          previewUrl={file.objectUrl}
          handleRemoveFile={handleRemoveFile}
          isDeleting={file.isDeleting}
          fileType={file.fileType}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  }

  useEffect(() => {
    return () => {
      if (file.objectUrl && !file.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(file.objectUrl);
      }
    };
  }, [file.objectUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      fileTypeAccepted === "video" ? { "video/*": [] } : { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize:
      fileTypeAccepted === "image" ? 5 * 1024 * 1024 : 500 * 1024 * 1024,
    onDropRejected,
    disabled: file.uploading || !!file.objectUrl,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed w-full h-64 transition-colors duration-200 ease-in-out",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex justify-center items-center p-4 w-full h-full">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
}
