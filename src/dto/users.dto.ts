import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

class AddUserDto {
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    readonly role: string;
}

class CreateUserDto {
    @IsNotEmpty()
    @MinLength(16)
    readonly password: string;
}

class LoginUserDto {
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;
}

export { AddUserDto, CreateUserDto, LoginUserDto };
