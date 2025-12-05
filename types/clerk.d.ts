
import type { AuthFn } from '@clerk/nextjs/dist/types/app-router/server/auth';
import type { clerkMiddleware as ClerkMiddlewareType } from '@clerk/nextjs/dist/types/server/clerkMiddleware';
import type { currentUser as CurrentUserType } from '@clerk/nextjs/dist/types/app-router/server/currentUser';
import type { getAuth as GetAuthType } from '@clerk/nextjs/dist/types/server/createGetAuth';

declare module '@clerk/nextjs/server' {
  export const auth: AuthFn;
  export const clerkMiddleware: typeof ClerkMiddlewareType;
  export const currentUser: typeof CurrentUserType;
  export const getAuth: typeof GetAuthType;
}


declare module '@clerk/nextjs/server' {
    interface SessionClaims {
        email: string;
        fullName: string;
        imageUrl: string;
    }
}