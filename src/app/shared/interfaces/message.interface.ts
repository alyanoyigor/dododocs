import { AppRouter } from '@/core/trpc';
import { inferRouterOutputs } from '@trpc/server';

type RouterOutput = inferRouterOutputs<AppRouter>;

type Messages = RouterOutput['getFileMessages']['messages'];

type OmitText = Omit<Messages[number], 'text'>;

type ExtendedText = {
  text: string | JSX.Element;
};

type ExtendedMessage = OmitText & ExtendedText;

export default ExtendedMessage;
