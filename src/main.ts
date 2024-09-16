import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());
  //not working
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector), { excludeExtraneousValues: true, enableImplicitConversion: true }))

  /**
   * Swagger
   */
  const options = new DocumentBuilder()
    .setTitle('Backend Ttest')
    .setDescription('The Backend API description')
    .setVersion('1.0')
    .addTag('Products')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
   console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
