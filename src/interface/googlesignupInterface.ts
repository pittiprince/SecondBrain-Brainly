export interface googleConfig {
    authRequired: boolean;
    auth0Logout: boolean;
    secret: string | undefined;
    baseURL: string | undefined;
    clientID: string | undefined; 
    issuerBaseURL: string | undefined; 
}