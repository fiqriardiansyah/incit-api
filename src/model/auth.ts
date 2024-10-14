export interface Auth {
    email: string;
    firstName: string;
    lastName?: string;
    picture?: string;
    accessToken?: string;
}

export interface SignEmail {
    email: string;
    password: string
}