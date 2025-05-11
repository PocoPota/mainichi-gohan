// components/LogoutButton.tsx (例)
"use client";

import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation"; // App Routerを使用する場合
import { useState } from "react";

import { Button } from "antd";

export default function LogoutButton() {
  const auth = getAuth();
  const router = useRouter(); // App Routerを使用する場合
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      router.push("/");
    } catch (error: any) {
      console.error("ログアウトエラー:", error);
      // エラー処理
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      color="default"
      variant="solid"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? "ログアウト中..." : "ログアウト"}
    </Button>
  );
}
