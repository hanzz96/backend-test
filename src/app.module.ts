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
      process.env.MONGO_URI
    ),
    AuthModule,
    ProductModule,
    WarrantyclaimModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
