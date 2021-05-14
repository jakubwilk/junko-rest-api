import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

class AddUserDto {
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    readonly role: number;
}

class CreateUserDto {
    @IsNotEmpty()
    @MinLength(16)
    readonly password: string;
}

class LoginUserDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;

    readonly isRemember: boolean;
}

class RegisterUserDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;
}

export { AddUserDto, CreateUserDto, LoginUserDto, RegisterUserDto };
