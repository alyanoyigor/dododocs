import { FieldValues, Path } from 'react-hook-form';

export type AuthInputData<T extends FieldValues> = {
  title: string;
  key: Path<T>;
  type: string;
  autoComplete?: string;
};

export enum CookieKeys {
  TOKEN = 'token',
}
