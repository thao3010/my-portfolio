import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentLibraryModule } from '../content-library/content-library.module';
import { SkillsModule } from '../skills/skills.module';
import { Portfolio } from './entities/portfolio.entity';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';
import { CvPdfService } from './cv-pdf.service';
import { PublicPortfoliosController } from './public-portfolios.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Portfolio]),
    ContentLibraryModule,
    SkillsModule,
  ],
  controllers: [PortfoliosController, PublicPortfoliosController],
  providers: [PortfoliosService, CvPdfService],
  exports: [PortfoliosService],
})
export class PortfoliosModule {}
