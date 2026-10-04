import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@portfolio/shared';

@ApiTags('Health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Service health and locale metadata' })
  health() {
    return {
      status: 'ok',
      service: 'portfolio-api',
      publicUrlPattern: `/{locale}/{username}`,
      supportedLocales: SUPPORTED_LOCALES,
      defaultLocale: DEFAULT_LOCALE,
    };
  }
}
