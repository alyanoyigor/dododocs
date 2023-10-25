'use client';

import { KeyboardEvent, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCw,
  Search,
} from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useForm } from 'react-hook-form';
import { useResizeDetector } from 'react-resize-detector';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SimpleBar from 'simplebar-react';

import { cn } from '@/lib/utils';
import { useToast } from './ui/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import PdfFullscreen from './PdfFullscreen';
import DocumentPage from './DocumentPage';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type PdfRendererProps = {
  url: string;
};

const PdfRenderer = ({ url }: PdfRendererProps) => {
  const [pages, setPages] = useState<number | null>(null);
  const [curPage, setCurPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine(
        (page) => Number(page) > 0 && pages !== null && Number(page) <= pages
      ),
  });
  type CustomPageValidatorType = z.infer<typeof CustomPageValidator>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CustomPageValidatorType>({
    defaultValues: {
      page: curPage.toString(),
    },
    resolver: zodResolver(CustomPageValidator),
  });

  const onClickPrevPageButton = () => {
    setCurPage((prevPage) => (prevPage - 1 > 1 ? prevPage - 1 : 1));
    setValue('page', String(curPage - 1));
  };

  const onClickNextPageButton = () => {
    if (pages !== null) {
      setCurPage((prevPage) => (prevPage + 1 > pages ? pages : prevPage + 1));
      setValue('page', String(curPage + 1));
    }
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit(({ page }) => {
        setCurPage(Number(page));
        setValue('page', String(page));
      })();
    }
  };

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            disabled={curPage <= 1}
            onClick={onClickPrevPageButton}
            variant="ghost"
            aria-label="previous page"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input
              {...register('page')}
              onKeyDown={onInputKeyDown}
              className={cn(
                'w-12 h-8',
                errors.page && 'focus-visible:ring-red-500'
              )}
            />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{pages ?? 'x'}</span>
            </p>
          </div>

          <Button
            disabled={pages === null || curPage >= pages}
            onClick={onClickNextPageButton}
            variant="ghost"
            aria-label="previous page"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1.5" aria-label="zoom" variant="ghost">
                <Search className="h-4 w-4" />
                <span className="opacity-60">{scale * 100}%</span>{' '}
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(0.5)}>
                50%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setRotation((prev) => (prev >= 360 ? 0 : prev + 90))}
            variant="ghost"
            aria-label="rotate 90 degrees"
          >
            <RotateCw className="h-4 w-4" />
          </Button>

          <PdfFullscreen
            curPage={curPage}
            url={url}
            pages={pages}
            handleLoadSuccess={({ numPages }) => setPages(numPages)}
          />
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <DocumentPage
          url={url}
          handleLoadSuccess={({ numPages }) => setPages(numPages)}
          scale={scale}
          page={({ width, loading, className, onRenderSuccess }) => (
            <Page
              className={className}
              onRenderSuccess={onRenderSuccess}
              loading={loading}
              width={width}
              pageNumber={curPage}
              scale={scale}
              rotate={rotation}
            />
          )}
        />
      </div>
    </div>
  );
};

export default PdfRenderer;
