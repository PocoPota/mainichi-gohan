// components/SignInButton.tsx (例)
"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebase"; // 上記で作成したfirebase.tsからauthをインポート

import { Button } from "antd";

export default function SignInButton() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      // エラー処理
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      color="default"
      variant="solid"
      onClick={handleSignIn}
      disabled={loading}
    >
      {loading ? "サインイン中..." : "Googleでサインイン"}
    </Button>
  );
}
