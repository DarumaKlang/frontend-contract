// lib/env.ts - Environment variables validation
// Ensures all required env vars are set before app starts

interface RequiredEnvVars {
  // Stripe
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
  
  // Supabase
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_JWT_SECRET: string;
  
  // App
  NEXT_PUBLIC_APP_URL: string;
}

/**
 * Validate that all required environment variables are set
 * @throws Error if any required variable is missing
 */
export function validateEnv(): void {
  const requiredVars: Record<keyof RequiredEnvVars, string | undefined> = {
    // Stripe
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    
    // Supabase
    SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET,
    
    // App
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || process.env.DOMAIN,
  };

  const missing: string[] = [];
  
  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value || value.trim() === '') {
      missing.push(key);
    }
  }
  
  if (missing.length > 0) {
    const errorMsg = `❌ Missing required environment variables:\n${missing.map(k => `  - ${k}`).join('\n')}\n\nPlease set them in your .env file.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  console.log('✅ All required environment variables are set');
}

/**
 * Get validated environment variables
 * @throws Error if validation hasn't been run or failed
 */
export function getEnv(): RequiredEnvVars {
  return {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    SUPABASE_URL: (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)!,
    SUPABASE_ANON_KEY: (process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET!,
    NEXT_PUBLIC_APP_URL: (process.env.NEXT_PUBLIC_APP_URL || process.env.DOMAIN)!,
  };
}

/**
 * Optional environment variables with defaults
 */
export function getOptionalEnv() {
  return {
    PRICE_ID: process.env.PRICE_ID || '',
    STRIPE_CURRENCY: process.env.STRIPE_CURRENCY || 'usd',
    NODE_ENV: process.env.NODE_ENV || 'development',
    BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  };
}

// Run validation only in production or when explicitly requested
if (process.env.NODE_ENV === 'production' || process.env.VALIDATE_ENV === 'true') {
  try {
    validateEnv();
  } catch (error) {
    // In production, fail fast
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
}
