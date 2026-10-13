export interface GoogleAuthInterface {
    name: string;
    email: string;
    email_verified: boolean;
    SecretKey?: string; // legacy field, no longer written
}
