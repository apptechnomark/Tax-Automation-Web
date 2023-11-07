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