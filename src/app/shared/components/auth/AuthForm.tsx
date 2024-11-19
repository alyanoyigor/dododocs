import { AuthInputData } from "@/app/shared/interfaces/auth.interface";
import { MouseEvent } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

import { Button } from "../ui/button";
import AuthInput from "./AuthInput";
import { Loader2 } from "lucide-react";

type AuthFormType<T extends FieldValues> = {
  title: string;
  inputs: AuthInputData<T>[];
  errors: FieldErrors;
  register: UseFormRegister<T>;
  onSubmit: (event: MouseEvent<HTMLButtonElement>) => void;
  isLoading: boolean;
};

function AuthForm<T extends FieldValues>({
  title,
  inputs,
  errors,
  register,
  onSubmit,
  isLoading
}: AuthFormType<T>) {
  return (
    <div className="p-8 bg-white border-gray-200 rounded">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <form>
        {inputs.map((inputInfo: AuthInputData<T>) => (
          <AuthInput
            key={inputInfo.key}
            inputInfo={inputInfo}
            error={errors[inputInfo.key]?.message?.toString()}
            registerData={register(inputInfo.key)}
            disabled={isLoading}
          />
        ))}

        {errors.root && (
          <p className="text-red-500 text-xs mt-1">
            {errors.root.message}
          </p>
        )}

        <Button
          onClick={onSubmit}
          variant="default"
          className="mt-4 w-full h-[40px] max-w-[160px]"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : title}
        </Button>
      </form>
    </div>
  );
}

export default AuthForm;