'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { trpc } from '../_trpc/client';

const AuthCallback = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get('origin');

  const { data, isLoading } = trpc.greeting.useQuery();

  return (
    <>
      {isLoading && <div>Loading</div>}
      {!isLoading && data && <div>{data}</div>}
    </>
  );
};

export default AuthCallback;
