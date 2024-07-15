
export interface I_User {
  id: number;
  name: string;
  timestamp: number;
}

export interface I_AddUser_Body {
  name: string;
  timestamp: string
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