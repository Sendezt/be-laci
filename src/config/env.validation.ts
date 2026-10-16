import { plainToInstance } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumberString,
  validateSync,
} from 'class-validator';

class EnvVars {
  @IsString() DATABASE_URL: string;
  @IsString() JWT_SECRET: string;
  @IsString() JWT_EXPIRES_IN: string;
  @IsString() COOKIES_NAME: string;
  @IsOptional() @IsString() COOKIES_SECURE?: string;
  @IsOptional() @IsNumberString() PORT?: string;
  @IsOptional() @IsString() CORS_ORIGIN?: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const parsed = plainToInstance(EnvVars, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(parsed, { skipMissingProperties: false });
  if (errors.length > 0) throw new Error(errors.toString());
  return parsed;
}
