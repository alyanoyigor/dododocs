import { Loader2 } from 'lucide-react';
import { Document } from 'react-pdf';
import SimpleBar from 'simplebar-react';
import { useResizeDetector } from 'react-resize-detector';
import { useToast } from './ui/use-toast';
import { OnDocumentLoadSuccess } from '../../node_modules/react-pdf/dist/cjs/shared/types';
import { cn } from '@/core/lib/utils';
import { ReactNode, useState } from 'react';

type DocumentPageProps = {
  url: string;
  handleLoadSuccess: OnDocumentLoadSuccess;
  page: (props: {
    width: number;
    className?: string;
    loading?: ReactNode;
    onRenderSuccess?: () => void;
  }) => JSX.Element | JSX.Element[];
  scale?: number;
  className?: string;
};

const DocumentPage = ({
  url,
  page: Page,
  scale,
  className,
  handleLoadSuccess,
}: DocumentPageProps) => {
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();
  const [renderedScale, setRenderedScale] = useState<number | null>(null);
  const isLoading = renderedScale !== scale;
  return (
    <SimpleBar
      autoHide={false}
      className={cn('max-h-[calc(100vh-10rem)]', className)}
    >
      <div ref={ref}>
        <Document
          loading={
            <div className="flex justify-center">
              <Loader2 className="my-24 h-6 w-6 animate-spin" />
            </div>
          }
          onLoadError={() =>
            toast({
              title: 'Error loading pdf',
              description: 'Please try again later',
              variant: 'destructive',
            })
          }
          onLoadSuccess={handleLoadSuccess}
          file={url}
          className="max-h-full"
        >
          {isLoading && renderedScale && (
            <Page key={'@' + renderedScale} width={width ? width : 1} />
          )}

          <Page
            className={cn(isLoading ? 'hidden' : '')}
            key={'@' + scale}
            width={width ? width : 1}
            loading={
              <div className="flex justify-center">
                <Loader2 className="my-24 h-6 w-6 animate-spin" />
              </div>
            }
            onRenderSuccess={() => setRenderedScale(scale ?? null)}
          />
        </Document>
      </div>
    </SimpleBar>
  );
};

export default DocumentPage;
