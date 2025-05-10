"use client";

import { useAuth } from "../context/authContext";
import SignInButton from "../components/SignInButton";
import LogoutButton from "../components/LogoutButton";
import styles from "./page.module.scss";
import Loading from "../components/Loading";

export default function Settings() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return (
      <div className={styles.settings}>
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
      <div className={styles.userInfo}>
        {currentUser.photoURL && (
          <img
            src={currentUser.photoURL}
            alt="Profile"
            width="50"
            height="50"
          />
        )}
        <p>ようこそ、{currentUser.displayName || currentUser.email} さん！</p>
      </div>
      <div className={styles.accountBtn}>
        <LogoutButton />
      </div>
    </div>
  );
}
