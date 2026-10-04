import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { AdminModule } from './admin/admin.module';
import { HealthController } from './health/health.controller';
import { Portfolio } from './portfolios/entities/portfolio.entity';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { ContactProfile } from './content-library/entities/contact-profile.entity';
import { Experience } from './content-library/entities/experience.entity';
import { Project } from './content-library/entities/project.entity';
import { ContentLibraryModule } from './content-library/content-library.module';
import { Skill } from './skills/entities/skill.entity';
import { SkillsModule } from './skills/skills.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '../../.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.name'),
        entities: [User, Portfolio, Skill, Experience, Project, ContactProfile],
        synchronize: false,
      }),
    }),
    UsersModule,
    AuthModule,
    PortfoliosModule,
    ContentLibraryModule,
    SkillsModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
