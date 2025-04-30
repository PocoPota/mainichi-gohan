'use client'

import SignInButton from "../components/signInButton";

export default function Home() {
  return (
    <div>
      <h1>設定</h1>
      <section>
        <h2>アカウント設定</h2>
        <SignInButton/>
        <p>※新規アカウントの作成は制限されています</p>
      </section>
      <section>
        <h2>一般設定</h2>
      </section>
    </div>
  );
}