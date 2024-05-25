

export interface Credential {
    email: string,
    password: string
}

export interface User {
    email: string,
    password: string,
    photoURL?: string,
    displayName?: string,
}