declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENVIRONMENT: string;
      NEXT_PUBLIC_FIREBASE_API_KEY: string;
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
      NEXT_PUBLIC_FIREBASE_APP_ID: string;
      NEXT_PUBLIC_USE_FIREBASE_EMULATOR: string;
      ADMIN_SDK_SERVICE_ACCOUNT_KEY: string;
      AUTH_COOKIE_SIGNATURE_KEY: string;
    }
  }
}

export {};
