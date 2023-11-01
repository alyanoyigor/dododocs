import { ChangeEvent, ReactNode, createContext, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { trpc } from '@/app/_trpc/client';
import { INFINITE_QUERY_LIMIT } from '@/config';
import { useToast } from '../ui/use-toast';

type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: '',
  handleInputChange: () => {},
  isLoading: false,
});

type ChatContextProviderProps = {
  fileId: string;
  children: ReactNode;
};

export const ChatContextProvider = ({
  fileId,
  children,
}: ChatContextProviderProps) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const utils = trpc.useContext();
  const backupMessage = useRef('');

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch('/api/message', {
        method: 'POST',
        body: JSON.stringify({
          fileId,
          message,
        }),
      });

      if (!response?.ok) {
        throw new Error('Message does not received!');
      }

      return response.body;
    },
    onMutate: async ({ message }) => {
      backupMessage.current = message;
      setMessage('');

      await utils.getFileMessages.cancel();
      const previousMessages = utils.getFileMessages.getInfiniteData();
      utils.getFileMessages.setInfiniteData(
        {
          fileId,
          limit: INFINITE_QUERY_LIMIT,
        },
        (old) => {
          if (!old) {
            return { pages: [], pageParams: [] };
          }
          let newPages = [...old.pages];
          let latestPage = newPages[0];

          latestPage.messages = [
            {
              createdAt: new Date().toISOString(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
            },
            ...latestPage.messages,
          ];
          newPages[0] = latestPage;

          return {
            ...old,
            pages: newPages,
          };
        }
      );

      setIsLoading(true);
      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },

    onSuccess: async (stream) => {
      setIsLoading(false);
      if (!stream) {
        return toast({
          title: 'There was a problem sending this message',
          description: 'Plese refresh page and try again',
          variant: 'destructive',
        });
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      let accResponse = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        const chunkValue = decoder.decode(value);
        accResponse += chunkValue;

        // add chunk to message
        utils.getFileMessages.setInfiniteData(
          {
            fileId,
            limit: INFINITE_QUERY_LIMIT,
          },
          (old) => {
            if (!old) {
              return { pages: [], pageParams: [] };
            }
            let isAiResponseCreated = old.pages.some((page) =>
              page.messages.some((message) => message.id === 'ai-response')
            );

            let updatedPages = old.pages.map((page) => {
              if (page === old.pages[0]) {
                let updatedMessages;
                if (!isAiResponseCreated) {
                  updatedMessages = [
                    {
                      createdAt: new Date().toISOString(),
                      id: 'ai-response',
                      text: accResponse,
                      isUserMessage: false,
                    },
                    ...page.messages,
                  ];
                } else {
                  updatedMessages = page.messages.map((message) => {
                    if (message.id === 'ai-reponse') {
                      return {
                        ...message,
                        text: accResponse,
                      };
                    }
                    return message;
                  });
                }

                return {
                  ...page,
                  messages: updatedMessages,
                };
              }

              return page;
            });

            return { ...old, pages: updatedPages };
          }
        );
      }
    },

    onError: (_, __, context) => {
      setMessage(backupMessage.current);
      utils.getFileMessages.setData(
        { fileId },
        { messages: context?.previousMessages ?? [] }
      );
    },

    onSettled: async () => {
      setIsLoading(false);

      await utils.getFileMessages.invalidate({ fileId });
    },
  });

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const addMessage = () => sendMessage({ message });

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
