'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Dropzone from 'react-dropzone';
import { Cloud, File } from 'lucide-react';
import { Progress } from './ui/progress';
import { useToast } from './ui/use-toast';
import { trpc } from '@/app/_trpc/client';
import { useUploadThing } from '@/lib/uploadthing';

const UploadDropzone = () => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { startUpload } = useUploadThing('pdfUploader');
  const { toast } = useToast();

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      // when file successfully upload
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  const startSimulateProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((progress) => {
        if (progress >= 95) {
          clearInterval(interval);
          return progress;
        }
        return progress + 5;
      });
    }, 500);

    return interval;
  };

  const onDrop = async (files: File[]) => {
    setIsUploading(true);

    const progressInterval = startSimulateProgress();
    const uploadResponse = await startUpload(files);
    const showErrorNotification = toast.bind(null, {
      title: 'Something went wrong',
      description: 'Please try again later',
      variant: 'destructive',
    });
    if (!uploadResponse) {
      return showErrorNotification();
    }
    const [fileResponse] = uploadResponse;
    const key = fileResponse?.key;
    if (!key) {
      return showErrorNotification();
    }

    clearInterval(progressInterval);
    setUploadProgress(100);

    startPolling({ key });
  };

  return (
    <Dropzone multiple={false} onDrop={onDrop}>
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-400 rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-zinc-500 text-xs">PDF (up to 4MB)</p>
              </div>

              {!isUploading &&
                Boolean(acceptedFiles) &&
                Boolean(acceptedFiles[0]) && (
                  <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                    <div className="px-3 py-2 h-full grid place-items-center">
                      <File className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="px-3 py-2 h-full text-sm truncate">
                      {acceptedFiles[0].name}
                    </div>
                  </div>
                )}
              {isUploading && (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    value={uploadProgress}
                    className="h-1 w-full bg-zinc-200"
                  />
                </div>
              )}

              <input
                {...getInputProps()}
                type="file"
                id="dropzone-file"
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default UploadDropzone;
