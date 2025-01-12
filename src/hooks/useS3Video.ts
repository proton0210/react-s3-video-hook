import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { useQuery } from "@tanstack/react-query";

export const useS3Video = (
  s3Client: S3Client,
  bucketName: string,
  key: string
) => {
  return useQuery({
    queryKey: ["s3Video", bucketName, key],
    queryFn: async () => {
      try {
        if (!key) {
          throw new Error("Key is undefined or empty");
        }
        const command = new GetObjectCommand({
          Bucket: bucketName,
          Key: key,
        });

        const response: GetObjectCommandOutput = await s3Client.send(command);
        if (response.Body) {
          const chunks: Uint8Array[] = [];
          for await (const chunk of response.Body as any) {
            chunks.push(chunk);
          }
          const blob = new Blob(chunks, { type: "video/mp4" });
          return URL.createObjectURL(blob);
        }
        throw new Error("Response body is empty");
      } catch (error: any) {
        console.error("Error fetching video from S3:", error);
        throw new Error(`Failed to fetch video: ${error.message}`);
      }
    },
  });
};
