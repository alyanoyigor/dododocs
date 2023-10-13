'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button>Upload PDF</Button>
      </DialogTrigger>

      <DialogContent>Example content</DialogContent>
    </Dialog>
  );
};

export default UploadButton;
