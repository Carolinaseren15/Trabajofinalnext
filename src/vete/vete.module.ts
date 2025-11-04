import { Module } from '@nestjs/common';
import { VeteController } from './vete.controller';
import { VeteService } from './vete.service';

@Module({
  controllers: [VeteController],
  providers: [VeteService],
})
export class VeteModule {}
