import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { WarrantyclaimModule } from './warranty/warrantyclaim.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@backend-test.9xllm.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=backend-test`),
    AuthModule,
    ProductModule,
    WarrantyclaimModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
