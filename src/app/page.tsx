"use client";

import { useAuth } from "./context/authContext";
import ContentsGrid from "./components/ContentsGrid";
import PostButtons from "./components/PostButtons";
import styles from "./page.module.scss";
import Loading from "./components/Loading";

export default function Home() {
  const { currentUser, loading } = useAuth();

  // 認証状態のロード中は何も表示しないか、ローディング表示
  if (loading) {
    return <Loading/>;
  }

  return (
    <div className={styles.top}>
      <ContentsGrid />
      <PostButtons isLogin={currentUser != null} />
    </div>
  );
}
