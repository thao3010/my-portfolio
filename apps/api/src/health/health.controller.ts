import { Controller, Get } from '@nestjs/common';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@portfolio/shared';

@Controller()
export class HealthController {
  @Get('health')
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
