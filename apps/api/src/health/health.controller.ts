import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PUBLIC_URL_PATTERN } from '@portfolio/shared';

@ApiTags('Health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Service health and public URL metadata' })
  health() {
    return {
      status: 'ok',
      service: 'portfolio-api',
      publicUrlPattern: PUBLIC_URL_PATTERN,
    };
  }
}
