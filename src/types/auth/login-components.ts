import type { FormEvent } from "react";

export interface LoginState {
  step: "email" | "password";
  emailOrUsername: string;
  password: string;
  error: string;
  isLoading: boolean;
  redirectTo: string | null;
}

export interface LoginActions {
  setEmailOrUsername: (value: string) => void;
  setPassword: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  addLog: (msg: string) => void;
}

export interface LoginFormProps {
  state: LoginState;
  actions: LoginActions;
}
