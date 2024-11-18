import { FieldValues, Path } from "react-hook-form";

export enum AuthTabsEnum {
  SIGN_UP = 'sign-up',
  SIGN_IN = 'sign-in',
}

export type AuthInputData<T extends FieldValues> = {
  title: string;
  key: Path<T>;
  type: string;
  autoComplete?: string;
};
