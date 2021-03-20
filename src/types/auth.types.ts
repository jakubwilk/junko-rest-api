export type UserInitializeToken = {
    email: string;
    expireIn: string | number;
};

export type UserSessionToken = {
    id: string;
    role: number;
    expireIn?: string | number;
};
