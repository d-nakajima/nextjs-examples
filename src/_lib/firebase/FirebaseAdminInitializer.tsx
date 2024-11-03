import { initializeApp } from "firebase-admin/app";
import { credential } from "firebase-admin";
import { ReactNode } from "react";

// ====================================================================================
// base64エンコードされたSAをsecretに保存し、それをデコードして環境変数に設定する必要があります
// ====================================================================================
// - name: Create dot env file
//   working-directory: ${{ env.WORKING_DIR }}
//   shell: bash
//   env:
//     ADMIN_SDK_SERVICE_ACCOUNT_KEY_BASE64: ${{ secrets.ADMIN_SDK_SERVICE_ACCOUNT_KEY_BASE64 }}
//   run: |
//     touch .env
//     echo "ADMIN_SDK_SERVICE_ACCOUNT_KEY='$(echo ${ADMIN_SDK_SERVICE_ACCOUNT_KEY_BASE64} | base64 --decode)'" >> .env

type Props = {
  children: ReactNode;
};

export default async function FirebaseAdminInitializer(props: Props) {
  try {
    const key = process.env.ADMIN_SDK_SERVICE_ACCOUNT_KEY;
    const credentials = JSON.parse(key.replace(/\n/g, "\\n"));

    initializeApp({
      credential: credential.cert(credentials),
    });
  } catch (_e) {
    const e = _e as Error;
    if ((e?.message as string).includes("already exists")) {
      // ignore
    } else {
      console.log(e);
    }
  }

  return props.children;
}
