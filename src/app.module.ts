import { Module } from '@nestjs/common';
import { VeteModule } from './vete/vete.module';

@Module({
  imports: [VeteModule],
})
export class AppModule {}
