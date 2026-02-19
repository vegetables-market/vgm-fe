import type { FormEvent } from "react";

export interface LoginState {
  emailOrUsername: string;
  error: string;
  isLoading: boolean;
  redirectTo: string | null;
}

export interface LoginActions {
  setEmailOrUsername: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  addLog: (msg: string) => void;
}

export interface LoginFormProps {
  state: LoginState;
  actions: LoginActions;
}
