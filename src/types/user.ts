
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