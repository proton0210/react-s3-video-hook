# react-s3-video-hook

A powerful and type-safe React hook for fetching and displaying videos from AWS S3. Built with AWS SDK v3 and React Query, this package provides an efficient way to handle S3 video operations in your React applications.

## Features

- 🚀 Built with AWS SDK v3
- 💾 Automatic caching with React Query
- 📦 TypeScript support
- 🔄 Proper cleanup of blob URLs
- ⚡ Efficient streaming of video data
- 🛡️ Error handling and loading states
- 🎨 Customizable video component
- 🎥 Support for video controls and attributes

## Installation

```bash
npm install react-s3-video-hook @aws-sdk/client-s3 @tanstack/react-query
```

or

```bash
yarn add react-s3-video-hook @aws-sdk/client-s3 @tanstack/react-query
```

## Setup

### 1. AWS S3 CORS Configuration

First, configure CORS for your S3 bucket. In your bucket permissions, add the following CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedOrigins": ["http://localhost:3000", "https://your-domain.com"],
    "ExposeHeaders": []
  }
]
```

Replace `https://your-domain.com` with your actual domain.

### 2. Set up React Query

Wrap your application with `QueryClientProvider`:

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}
```

## Usage

### Using the S3Video Component

#### Make sure the component you're calling is client component

The simplest way to display S3 videos:

```tsx
"use client"
import { S3Video } from "react-s3-video-hook";
import { S3Client } from "@aws-sdk/client-s3";

function MyComponent() {
  const s3Client = new S3Client({
    region: "your-region",
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_S3_READ_ACCESS!,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_READ_SECRET!,
    },
  });

  return (
    <div className="m-5">
      <S3Video
        s3Client={s3Client}
        bucketName="your-bucket-name"
        videoKey="path/to/video.mp4"
        className="max-w-2xl"
        autoPlay={false}
        controls={true}
        muted={false}
        loop={false}
        onError={(error) => console.error(error)}
        onLoad={() => console.log("Video loaded")}
      />
    </div>
  );
}
```

### Using the Hook Directly

For more control over the video display:

```tsx
"use client"

import { useS3Video } from "react-s3-video-hook";

function CustomVideoComponent() {
  const {
    data: videoUrl,
    isLoading,
    error,
  } = useS3Video(s3Client, "your-bucket-name", "path/to/video.mp4");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading video</div>;
  if (!videoUrl) return null;

  return (
    <video controls className="custom-video-class">
      <source src={videoUrl} type="video/mp4" />
    </video>
  );
}
```

## API Reference

### S3Video Component Props

| Prop       | Type     | Required | Description                      |
| ---------- | -------- | -------- | -------------------------------- |
| s3Client   | S3Client | Yes      | AWS S3 client instance           |
| bucketName | string   | Yes      | Name of the S3 bucket            |
| videoKey   | string   | Yes      | Path to the video in the bucket  |
| className  | string   | No       | CSS classes for the video        |
| autoPlay   | boolean  | No       | Auto-play video (default: false) |
| controls   | boolean  | No       | Show controls (default: true)    |
| muted      | boolean  | No       | Mute video (default: false)      |
| loop       | boolean  | No       | Loop video (default: false)      |
| onError    | function | No       | Error callback function          |
| onLoad     | function | No       | Load complete callback           |

### useS3Video Hook

```typescript
const { data, isLoading, error } = useS3Video(s3Client, bucketName, videoKey);
```

#### Parameters

- `s3Client`: AWS S3 client instance
- `bucketName`: Name of the S3 bucket
- `videoKey`: Path to the video in the bucket

#### Returns

- `data`: URL of the video (blob URL)
- `isLoading`: Boolean indicating loading state
- `error`: Error object if the fetch failed

## Best Practices

1. **Memory Management**: The hook automatically handles cleanup of blob URLs to prevent memory leaks.

2. **Error Handling**: Always implement error handling:

```tsx
<S3Video
  {...props}
  onError={(error) => {
    console.error("Video error:", error);
    // Handle error appropriately
  }}
/>
```

3. **Loading States**: Provide good UX during loading:

```tsx
{
  isLoading && <CustomLoadingSpinner />;
}
```

4. **Environment Variables**: Keep AWS credentials secure:

```env
NEXT_PUBLIC_S3_READ_ACCESS=your_access_key
NEXT_PUBLIC_S3_READ_SECRET=your_secret_key
```

## Common Issues and Solutions

### CORS Issues

If you encounter CORS errors:

1. Verify your S3 bucket CORS configuration
2. Ensure your domain is listed in AllowedOrigins
3. Check that you're using the correct region

### Video Loading Issues

If videos fail to load:

1. Verify the video format is supported (MP4 recommended)
2. Check file permissions in S3
3. Ensure proper IAM permissions are set

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
