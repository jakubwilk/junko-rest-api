import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Junko API')
        .setDescription('This is a Junko APP REST API description')
        .setVersion('1.0.0')
        .addTag('Team users')
        .addTag('Customers')
        .addTag('Orders')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    app.useGlobalPipes(
        new ValidationPipe({
            dismissDefaultMessages: true,
        }),
    );
    app.use(cookieParser());
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });
    await app.listen(4128);
}

bootstrap();
