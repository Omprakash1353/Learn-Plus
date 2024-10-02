"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Upload, X, Loader2 } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { chapterVideoUpload, getChapterVideo } from "../_action";
import { queryClient } from "@/contexts/query-provider";

export function ChapterVideoEdit({
  courseId,
  chapterId,
}: {
  courseId: string;
  chapterId: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isChanging, setIsChanging] = useState(false);

  const { data: chapterVideoPreview, isLoading } = useQuery({
    queryKey: [`chapters-${chapterId}-video`],
    queryFn: async () => {
      const res = await getChapterVideo(courseId, chapterId);
      if (!res?.success) throw new Error(res.error);
      return res.data;
    },
  });

  console.log("chapterVideoPreview", chapterVideoPreview);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await chapterVideoUpload(formData, courseId, chapterId);
      if (!res?.success) throw new Error(res.error);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`chapters-${chapterId}-video`],
      });
      setFile(null);
      setPreview(null);
      setIsChanging(false);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const videoFile = acceptedFiles[0];
    setFile(videoFile);
    setPreview(URL.createObjectURL(videoFile));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [] },
    maxFiles: 1,
  });

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    mutation.reset();
  };

  const handleUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.set("video", file);
      mutation.mutate(formData);
    }
  };

  const handleChange = () => {
    setIsChanging(true);
    setFile(null);
    setPreview(null);
  };

  const handleCancel = () => {
    setIsChanging(false);
    setFile(null);
    setPreview(null);
  };

  // Automatically enable "Change" mode if no video exists
  const shouldChange = !chapterVideoPreview?.video || isChanging;

  return (
    <Card className="w-full max-w-2xl border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Chapter Video</CardTitle>
        <div className="flex space-x-2">
          {!shouldChange && chapterVideoPreview?.video?.playbackId && (
            <Button onClick={handleChange}>Change Video</Button>
          )}
          {file && !mutation.isPending && (
            <Button onClick={handleUpload} disabled={mutation.isPending}>
              Upload Video
            </Button>
          )}
          {shouldChange && chapterVideoPreview?.video !== undefined && (
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...(shouldChange ? getRootProps() : {})}
          className={`relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-lg border-2 ${
            shouldChange
              ? `cursor-pointer border-dashed ${
                  isDragActive ? "border-primary bg-primary/10" : "border-muted"
                }`
              : "border-solid border-muted"
          }`}
        >
          {shouldChange && <input {...getInputProps()} />}
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : chapterVideoPreview?.video?.playbackId && !shouldChange ? (
            <MuxPlayer
              playbackId={chapterVideoPreview.video.playbackId}
              className="h-full w-full"
            />
          ) : preview ? (
            <video
              src={preview}
              controls
              className="h-full w-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          ) : shouldChange ? (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <Upload className="mb-2 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop a video file here, or click to select one
              </p>
            </div>
          ) : null}
        </div>

        {file && (
          <div className="flex items-center justify-between">
            <span className="truncate text-sm">{file.name}</span>
            <Button variant="ghost" size="icon" onClick={removeFile}>
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        )}

        {mutation.isPending && (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Uploading video...</span>
          </div>
        )}
        {mutation.isError && (
          <p className="text-destructive" role="alert">
            Error uploading video. Please try again.
          </p>
        )}
        {mutation.isSuccess && (
          <p className="text-primary" role="alert">
            Video uploaded successfully!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
