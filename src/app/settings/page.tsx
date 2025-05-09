"use client";

import { useAuth } from "../context/authContext";
import SignInButton from "../components/SignInButton";
import LogoutButton from "../components/LogoutButton";
import styles from "./page.module.scss"

export default function Settings() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <p>認証状態を確認中...</p>;
  }

  if (!currentUser) {
    return (
      <div className={styles.settings}>
        <h1>設定</h1>
        <div className={styles.userInfo}>
          <p>まだサインインしていません。</p>
        </div>
        <div className={styles.accountBtn}>
          <SignInButton />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.settings}>
      <h1>設定</h1>
      <div className={styles.userInfo}>
        {currentUser.photoURL && (
          <img src={currentUser.photoURL} alt="Profile" width="50" height="50" />
        )}
        <p>ようこそ、{currentUser.displayName || currentUser.email} さん！</p>
      </div>
      <div className={styles.accountBtn}>
        <LogoutButton />
      </div>
    </div>
  );
}
