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
    readonly role: number;
    readonly photo: string;
    readonly isActive: boolean;
    readonly createdAt: Date;
}

class EditUserDto {
    readonly firstName: string;
    readonly lastName: string;
    readonly photo: string;
    readonly role: number;
    readonly city: string;
    readonly phoneNumber: string;
}

export { UserDto, UsersDto, EditUserDto };
