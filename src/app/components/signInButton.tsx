// components/SignInButton.tsx (例)
"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebase"; // 上記で作成したfirebase.tsからauthをインポート

export default function SignInButton() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // ログイン成功！ユーザー情報がauthオブジェクトに反映されます。
      console.log("Google Sign-in successful!");
      // ログイン後のリダイレクトなどの処理をここに追加できます。
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      // エラー処理
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleSignIn} disabled={loading}>
      {loading ? "サインイン中..." : "Googleでサインイン"}
    </button>
  );
}
