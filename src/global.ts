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
    ResponseData: any;
    ErrorData: any;
  }
  
  export enum Role
  {
      Admin = 1,
      Employee = 2
  }

  export class TokenDataModel {
    Token: {
      Username: string
      Token: string
      TokenExpiry: string
    } | null
  }

  export class QboDataModel {
    access_token: string
    id: number
    qbo_accountname : string
    token_expiry : string
  }

