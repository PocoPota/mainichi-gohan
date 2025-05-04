"use client";

import { useAuth } from "../context/authContext";
import SignInButton from "../components/SignInButton";
import LogoutButton from "../components/LogoutButton";

export default function Settings() {
  const { currentUser, loading } = useAuth();

  // 認証状態のロード中は何も表示しないか、ローディング表示
  if (loading) {
    return <p>認証状態を確認中...</p>;
  }

  // ログインしていない場合はログインページにリダイレクト
  if (!currentUser) {
    return (
      <div>
        <SignInButton />
      </div>
    );
  }

  // ログインしているユーザー情報を使って表示
  return (
    <div>
      <h1>設定</h1>
      <p>
        ようこそ、{currentUser.displayName || currentUser.email} さん！
      </p>{" "}
      {/* 名前かメールアドレスを表示 */}
      {currentUser.photoURL && (
        <img src={currentUser.photoURL} alt="Profile" width="50" height="50" /> // プロフィール写真を表示 (あれば)
      )}
      <p>ユーザーID: {currentUser.uid}</p>
      <LogoutButton />
    </div>
  );
}
