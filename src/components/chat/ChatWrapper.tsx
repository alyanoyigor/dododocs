'use client';

import { trpc } from '@/app/_trpc/client';
import ChatInput from './ChatInput';
import Messages from './Messages';
import { ChevronLeft, Loader2, XCircle } from 'lucide-react';
import { FunctionComponent, ReactNode } from 'react';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';

type ChatWrapperProps = {
  fileId: string;
};

const ChatContainer = ({
  children,
  Input,
  Icon,
  title,
  description,
}: {
  Input: FunctionComponent;
  Icon: FunctionComponent;
  title: string;
  description: string | ReactNode;
  children?: ReactNode;
}) => {
  return (
    <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2 ">
      <div className="flex-1 justify-center items-center flex flex-col mb-28">
        <div className="flex flex-col items-center gap-2">
          <Icon />
          <h3 className="font-semibold text-xl">{title}</h3>
          <p className="text-zinc-500 text-sm">{description}</p>
          {children}
        </div>
      </div>

      <Input />
    </div>
  );
};

const ChatWrapper = ({ fileId }: ChatWrapperProps) => {
  const { isLoading, data } = trpc.getFileUploadStatus.useQuery(
    { fileId },
    {
      refetchInterval: (data) =>
        data?.status === 'SUCCESS' || data?.status === 'FAILED' ? false : 500,
    }
  );

  return (
    <>
      {isLoading && (
        <ChatContainer
          title="Loading..."
          description="We're preparing your PDF"
          Icon={() => (
            <Loader2 className="h-8 w-8 text-blue-800 animate-spin" />
          )}
          Input={() => <ChatInput disabled />}
        />
      )}
      {data?.status === 'PROCESSING' && (
        <ChatContainer
          title="Processing..."
          description="This won't take long"
          Icon={() => (
            <Loader2 className="h-8 w-8 text-blue-800 animate-spin" />
          )}
          Input={() => <ChatInput disabled />}
        />
      )}
      {data?.status === 'FAILED' && (
        <ChatContainer
          title="Too many pages in PDF"
          description={
            <>
              Your <span className="font-medium">Free</span> plan supports up to
              5 pages per PDF
            </>
          }
          Icon={() => <XCircle className="h-8 w-8 text-red-500" />}
          Input={() => <ChatInput disabled />}
        >
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: 'secondary',
              className: 'mt-4',
            })}
          >
            <ChevronLeft className="h-3 w-3 mr-1.5" /> Back
          </Link>
        </ChatContainer>
      )}
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 justify-between flex flex-col mb-28">
          <Messages />
        </div>

        <ChatInput />
      </div>
    </>
  );
};

export default ChatWrapper;
