import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Page } from 'react-pdf';
import { Expand } from 'lucide-react';
import { OnDocumentLoadSuccess } from '../../node_modules/react-pdf/dist/cjs/shared/types';
import DocumentPage from './DocumentPage';

type PdfFullscreenProps = {
  url: string;
  pages: number | null;
  curPage: number;
  handleLoadSuccess: OnDocumentLoadSuccess;
};

const PdfFullscreen = (props: PdfFullscreenProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { pages, url, handleLoadSuccess } = props;
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(visible) => {
        if (!visible) {
          setIsOpen(visible);
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button className="gap-1.5" variant="ghost" aria-label="fullscreen">
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
        <DocumentPage
          url={url}
          handleLoadSuccess={handleLoadSuccess}
          className="mt-7"
          page={({ width, loading }) =>
            Array.from(Array(pages)).map((_, index) => (
              <Page
                loading={loading || null}
                width={width}
                key={index}
                pageNumber={index + 1}
              />
            ))
          }
        />
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullscreen;
