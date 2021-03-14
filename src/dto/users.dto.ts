import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

class AddUserDto {
    @IsEmail({}, { message: 'Wprowadzono niepoprawny adres email' })
    readonly email: string;
}

class CreateUserDto {
    @IsNotEmpty()
    @MinLength(16)
    readonly password: string;
}

export { AddUserDto, CreateUserDto };
