import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Thêm ConfigModule nếu cần
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose'; // Quan trọng: Thiếu cái này

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [MongooseModule],
})
export class DatabaseModule {
  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
}
