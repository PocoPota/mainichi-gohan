'use client'

import { useAuth } from './context/authContext';
import ContentsGrid from "./components/ContentsGrid";
import PostButtons from "./components/PostButtons";

export default function Home() {
  const { currentUser, loading } = useAuth();
  
  // 認証状態のロード中は何も表示しないか、ローディング表示
  if (loading) {
    return <p>認証状態を確認中...</p>;
  }

  return (
    <div>
      <ContentsGrid/>
      <PostButtons isLogin={currentUser != null}/>
    </div>
  );
}
