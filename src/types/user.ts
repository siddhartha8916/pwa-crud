export interface I_User {
  id: number;
  name: string;
  timestamp: number;
}

export interface I_AddUser_Body {
  name: string;
  timestamp: string;
}
export interface I_PublicKeyResponse {
  publicKey: string;
}

export type Option = {
  value: number | string;
  label: string;
};

export type I_AddSurveyBody = {
  [key: string]: string | string[] | { [key: string]: string | string[] };
};

export type I_AddSurveyResponse = {
  [key: string]: string | string[] | { [key: string]: string | string[] };
};

export interface I_RegistrationBody {
  phone: string;
  password: string;
  username: string;
  cropName: string;
  farmingTool: string;
  subscription: PushSubscription | null;
}
export interface I_RegistrationResponse {
  token: string;
  userName: string;
  phone: string;
}

export interface ErrorResponse {
  errorCode: number;
  errorGroup: string;
  httpStatus: number;
  message: string;
  errors: {
      field: string;
      message: string;
  }[];
  timestamp: string;
}

export interface I_LoginBody {
  phone: string;
  password: string;
}
export interface I_LoginResponse {
  token: string;
  userName: string;
  phone: string;
}