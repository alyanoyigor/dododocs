import * as React from 'react';

import { cn } from '@/lib/utils';
import { Input } from './input';
import { Button } from './button';
import Icons from '../Icons';

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ containerClassName, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className={cn('relative w-full', containerClassName)}>
        <Input className={cn('pr-12', className)} type={showPassword ? 'text' : 'password'} ref={ref} {...props} />
        <Button
          variant="ghost"
          type="button"
          className="absolute w-12 p-0 h-full right-0 bottom-0 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          aria-label="Toggle password visibility"
        >
          {showPassword ? <Icons.eyeOff className="h-5 w-5" /> : <Icons.eye className="h-5 w-5" />}
        </Button>
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
