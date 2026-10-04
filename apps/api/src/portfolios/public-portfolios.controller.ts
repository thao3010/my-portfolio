import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { CvPdfService } from './cv-pdf.service';
import { PortfoliosService } from './portfolios.service';

@ApiTags('Public')
@Controller('public/portfolios')
export class PublicPortfoliosController {
  constructor(
    private readonly portfoliosService: PortfoliosService,
    private readonly cvPdfService: CvPdfService,
  ) {}

  @Get(':username/cv/download')
  @ApiOperation({
    summary: 'Download CV as PDF (CV layout, or portfolio layout fallback)',
  })
  @ApiParam({ name: 'username', example: 'jane-dev' })
  async downloadCv(
    @Param('username') username: string,
    @Res() res: Response,
  ) {
    const { user, portfolio } =
      await this.portfoliosService.getPublishedCvByUsername(username);
    const html = this.portfoliosService.buildCvHtml(portfolio, user.username);
    const pdf = await this.cvPdfService.renderHtmlToPdf(html);
    const filename = `${user.username}-cv.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}"`,
    );
    res.send(pdf);
  }

  @Get(':username')
  @ApiOperation({ summary: 'Published portfolio by username (public)' })
  @ApiParam({ name: 'username', example: 'jane-dev' })
  async getByUsername(@Param('username') username: string) {
    const { user, portfolio } =
      await this.portfoliosService.getPublishedByUsername(username);
    return {
      username: user.username,
      locale: user.preferredLocale,
      ...portfolio,
    };
  }
}
