export type CreateUserData = {
    email: string;
    password: string;
};

export type SingleUser = {
    id: string;
    firstName: string;
    lastName: string;
    photo: string;
    isActive: boolean;
    createdAt: Date;
};
