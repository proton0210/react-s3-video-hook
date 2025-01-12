"use client";
import React, { useEffect } from "react";
import { S3Client } from "@aws-sdk/client-s3";
import { useS3Video } from "../hooks/useS3Video";

export interface S3VideoProps {
  s3Client: S3Client;
  bucketName: string;
  videoKey: string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  onError?: (error: Error) => void;
  onLoad?: () => void;
}

export const S3Video: React.FC<S3VideoProps> = ({
  s3Client,
  bucketName,
  videoKey,
  className = "",
  autoPlay = false,
  controls = true,
  muted = false,
  loop = false,
  onError,
  onLoad,
}) => {
  const {
    data: videoUrl,
    isLoading,
    error,
  } = useS3Video(s3Client, bucketName, videoKey);

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  useEffect(() => {
    if (error && onError) {
      onError(error as Error);
    }
  }, [error, onError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-48 bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-48 bg-red-50 rounded-lg">
        <p className="text-red-500">
          Error:{" "}
          {error instanceof Error ? error.message : "Failed to load video"}
        </p>
      </div>
    );
  }

  if (!videoUrl) return null;

  return (
    <video
      className={`w-full rounded-lg ${className}`}
      autoPlay={autoPlay}
      controls={controls}
      muted={muted}
      loop={loop}
      onLoadedData={onLoad}
    >
      <source src={videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};
