class UserDto {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
}

class UsersDto {
    readonly id: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly photo: string;
    readonly isActive: boolean;
    readonly createdAt: Date;
}

export { UserDto, UsersDto };
