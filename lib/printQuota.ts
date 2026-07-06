export const PRINT_QUOTA_BY_PLAN = {
  starter: 3,
  professional: 10,
  enterprise: 30,
} as const;

export type SubscriptionPlan = keyof typeof PRINT_QUOTA_BY_PLAN;

export const DEFAULT_SUBSCRIPTION_PLAN: SubscriptionPlan = 'starter';

export const getCurrentQuotaMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export type UserProfile = {
  subscription_plan?: string;
  frequent_profile_data?: Record<string, unknown>;
};

export type ProfilePrintQuota = {
  plan: SubscriptionPlan;
  month: string;
  total: number;
  used: number;
  remaining: number;
};

export const normalizeSubscriptionPlan = (value: unknown): SubscriptionPlan => {
  if (typeof value !== 'string') return DEFAULT_SUBSCRIPTION_PLAN;
  const plan = value.toLowerCase();
  if (plan === 'professional' || plan === 'enterprise') {
    return plan;
  }
  return DEFAULT_SUBSCRIPTION_PLAN;
};

export const getProfilePrintQuota = (profile: UserProfile | null): ProfilePrintQuota => {
  const currentMonth = getCurrentQuotaMonth();
  const frequent = profile?.frequent_profile_data ?? {};
  const plan = normalizeSubscriptionPlan(
    (frequent.subscription_plan ?? profile?.subscription_plan) as string | undefined
  );

  const usage = frequent.print_usage as { month?: string; used?: number } | undefined;
  const used = usage?.month === currentMonth ? Number(usage.used ?? 0) : 0;
  const total = PRINT_QUOTA_BY_PLAN[plan] ?? PRINT_QUOTA_BY_PLAN.starter;

  return {
    plan,
    month: currentMonth,
    total,
    used,
    remaining: Math.max(0, total - used),
  };
};

export const buildPrintUsagePayload = (profile: UserProfile | null, increment = 1) => {
  const currentQuota = getProfilePrintQuota(profile);
  const nextUsed = currentQuota.used + increment;

  return {
    frequent_profile_data: {
      subscription_plan: currentQuota.plan,
      print_usage: {
        month: currentQuota.month,
        used: nextUsed,
      },
    },
  };
};
