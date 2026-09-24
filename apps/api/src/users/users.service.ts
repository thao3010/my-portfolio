import { AuthProvider, UserRole } from '@portfolio/shared';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

export type CreateLocalUserInput = {
  email: string;
  passwordHash: string;
  username: string;
  preferredLocale?: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username: username.toLowerCase() },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async createLocalUser(input: CreateLocalUserInput): Promise<User> {
    const email = input.email.toLowerCase();
    const username = input.username.toLowerCase();

    if (await this.findByEmail(email)) {
      throw new ConflictException('Email already registered');
    }
    if (await this.findByUsername(username)) {
      throw new ConflictException('Username already taken');
    }

    const user = this.usersRepository.create({
      email,
      username,
      passwordHash: input.passwordHash,
      role: UserRole.USER,
      authProvider: AuthProvider.LOCAL,
      preferredLocale: input.preferredLocale ?? 'en',
    });

    return this.usersRepository.save(user);
  }

  async updateRefreshTokenHash(
    userId: string,
    hash: string | null,
  ): Promise<void> {
    await this.usersRepository.update(
      { id: userId },
      { refreshTokenHash: hash },
    );
  }

  async getByIdOrFail(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
