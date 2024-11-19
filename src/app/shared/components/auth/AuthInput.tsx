import { FieldValues, UseFormRegisterReturn } from 'react-hook-form';

import { cn } from '@/core/lib/utils';
import { AuthInputData } from '@/app/shared/interfaces/auth.interface';

import { PasswordInput } from '../ui/password-input';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type AuthAuthInputData<T extends FieldValues> = {
  registerData: UseFormRegisterReturn;
  inputInfo: AuthInputData<T>;
  disabled: boolean;
  error?: string;
};

function AuthInput<T extends FieldValues>({
  error,
  registerData,
  inputInfo,
  disabled,
}: AuthAuthInputData<T>) {
  const { title, key, type, autoComplete } = inputInfo;
  const InputElement = type === 'password' ? PasswordInput : Input;

  return (
    <div className="flex flex-col items-start mb-3">
      <Label htmlFor={key} className="mb-1 text-sm">
        {title}
      </Label>
      <div className="relative w-full">
        <InputElement
          {...registerData}
          placeholder={title}
          type={type}
          className={cn(
            'w-[100%] h-9',
            error && 'border-red-500 focus-visible:ring-red-500',
          )}
          id={key}
          autoComplete={autoComplete || 'off'}
          disabled={disabled}
        />
      </div>
      {error && (
        <span className="inline-block text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
}

export default AuthInput;
