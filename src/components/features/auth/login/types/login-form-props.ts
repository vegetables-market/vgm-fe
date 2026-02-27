import type { FormEvent } from "react";

export type LoginState = {
  emailOrUsername: string;
  error: string;
  isLoading: boolean;
  redirectTo: string | null;
};

export type LoginActions = {
  setEmailOrUsername: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  addLog: (msg: string) => void;
};

export type LoginFormProps = {
  state: LoginState;
  actions: LoginActions;
  connectProvider?: "google" | "microsoft" | "github" | null;
};
