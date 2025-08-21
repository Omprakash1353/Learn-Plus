import { CloudUploadIcon, ImageIcon, Loader2, XIcon } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="text-center">
      <div className="flex justify-center items-center bg-muted mx-auto mb-4 rounded-full size-12">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="font-semibold text-foreground text-base">
        Drag your files here or{" "}
        <span className="font-bold text-primary cursor-pointer">
          click to upload
        </span>
      </p>
      <Button type="button" className="mt-4">
        Select File
      </Button>
    </div>
  );
}

export function RenderErrorState() {
  return (
    <div className="text-destructive text-center">
      <div className="flex justify-center items-center bg-destructive/30 mx-auto mb-4 rounded-full size-12">
        <ImageIcon className={cn("size-6 text-destructive")} />
      </div>
      <p className="font-semibold text-base">Upload Failed</p>
      <p className="mt-1 text-xs">Something went wrong</p>
      <Button type="button" className="mt-4">
        Retry File Selection
      </Button>
    </div>
  );
}

export function RenderUploadedState({
  previewUrl,
  isDeleting,
  handleRemoveFile,
  fileType,
}: {
  previewUrl: string;
  isDeleting: boolean;
  handleRemoveFile: () => void;
  fileType: "image" | "video";
}) {
  return (
    <div className="group relative flex justify-center items-center w-full h-full">
      {fileType === "video" ? (
        <video src={previewUrl} controls className="rounded-md w-full h-full" />
      ) : (
        <Image
          src={previewUrl}
          alt="Uploaded File"
          fill
          className="p-2 object-contain"
        />
      )}
      <Button
        variant="destructive"
        size="icon"
        className={cn("top-4 right-4 absolute")}
        onClick={handleRemoveFile}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <XIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}

export function RenderUploadingState({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) {
  return (
    <div className="flex flex-col justify-center items-center text-center">
      <p>{progress}</p>
      <p className="mt-2 font-medium text-foreground text-sm">Uploading...</p>
      <p className="mt-1 max-w-xs text-muted-foreground text-xs truncate">
        {file.name}
      </p>
    </div>
  );
}
