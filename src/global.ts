export const QboParams = {
  ResponseType: "code",
  Scope: "com.intuit.quickbooks.accounting",
  redirectUri: "http://localhost:4200/main/qbohome",
  State: "Home",
  GrantType: "authorization_code",
  GrantTypeForrefreshToken: "refresh_token"
}

export class qboDetail {
  code: string
  state: string
  realmId: string
}

export class TokenInfo {
  code: string
  companyId?:number
}

export class login {
  Username: String;
  Password: String;
}

export class ApiResponse{
  ResponseStatus : string;
  Message: string;
  ResponseData: {
    TwoFactorEnabled: boolean,
    Token: {
      Username: string;
      Token: string;
      TokenExpiry: string;
    } | null;
  } | null;
  ErrorData: {
    ErrorCode: string;
    Error: string;
    ErrorDetail: string | null;
  } | null;
}

export enum Role
{
    Admin = 1,
    Employee = 2
}


