import { validate } from 'class-validator';
import { IsPortfolioUsername } from './is-username';

class UsernameDto {
  @IsPortfolioUsername()
  username!: string;
}

describe('IsPortfolioUsername', () => {
  it('accepts valid usernames', async () => {
    const dto = new UsernameDto();
    dto.username = 'jane-doe';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects reserved names', async () => {
    const dto = new UsernameDto();
    dto.username = 'admin';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
