// Temporarily disabled @t3-oss/env-nextjs due to TypeScript compilation issue
// TODO: Fix @t3-oss/env-nextjs TypeScript issue
// import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
};
