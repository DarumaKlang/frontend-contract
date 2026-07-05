// next-auth.d.ts – minimal declarations to satisfy TypeScript compiler
declare module "next-auth" {
  import { NextApiHandler } from "next";
  import { NextAuthOptions } from "next-auth"; // re-export type for convenience
  const NextAuth: (options: NextAuthOptions) => NextApiHandler;
  export default NextAuth;
  export type { NextAuthOptions };
}

declare module "next-auth/providers/credentials" {
  import { CredentialProvider } from "next-auth/providers";
  const CredentialsProvider: CredentialProvider;
  export default CredentialsProvider;
}
