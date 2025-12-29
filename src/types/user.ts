export interface User {
    id: number;
    uuid: string;
    name: string;
    email: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface UpdatePayload extends Partial<User> {
    password?: string;
    password_confirmation?: string;
}