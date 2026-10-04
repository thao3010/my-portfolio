import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BEARER_SCHEME } from '../setup-swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PortfoliosService } from './portfolios.service';

@ApiTags('Portfolio')
@ApiBearerAuth(BEARER_SCHEME)
@Controller('me/portfolio')
@UseGuards(JwtAuthGuard)
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Get()
  @ApiOperation({ summary: 'Get or create portfolio for the current user' })
  async getMine(@CurrentUser() user: JwtPayload) {
    const portfolio = await this.portfoliosService.getOrCreateForUser(user.sub);
    return this.portfoliosService.toEditorResponse(portfolio);
  }

  @Put()
  @ApiOperation({ summary: 'Update portfolio profile, layouts, and publish flag' })
  async updateMine(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdatePortfolioDto,
  ) {
    const portfolio = await this.portfoliosService.updateForUser(
      user.sub,
      dto,
    );
    return this.portfoliosService.toEditorResponse(portfolio);
  }
}
