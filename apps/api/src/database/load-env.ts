import { config } from 'dotenv';
import { resolve } from 'path';

const envPaths = [
  resolve(process.cwd(), '.env'),
  resolve(process.cwd(), '../../.env'),
  resolve(__dirname, '../../../.env'),
];

for (const envPath of envPaths) {
  config({ path: envPath });
}
