import { notFound, redirect } from 'next/navigation';
import { db } from '@/db';
import PdfRenderer from '@/components/PdfRenderer';
import ChatWrapper from '@/components/ChatWrapper';
import { getKindeUser } from '@/lib/auth';

interface FilePageProps {
  params: {
    fileid: string;
  };
}

const FilePage = async ({ params }: FilePageProps) => {
  const { fileid } = params;
  const user = getKindeUser();
  const redirectPath = '/auth-callback?origin=dashboard';

  if (!user || !user.id) {
    redirect(redirectPath);
  }

  const file = await db.file.findFirst({
    where: { id: fileid, userId: user.id },
  });

  if (!file) {
    notFound();
  }

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PdfRenderer />
          </div>
        </div>

        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper />
        </div>
      </div>
    </div>
  );
};

export default FilePage;