"use client";

import styles from "./PostsButtons.module.scss";

type Props = {
  isLogin: boolean;
};

export default function PostButtons(props: Props) {
  if (props.isLogin) {
    return (
      <div className={styles.buttons}>
        <div className={styles.button}>
          <a href="/settings">設定</a>
        </div>
        <div className={styles.button}>
          <a href="/post">投稿</a>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.buttons}>
        <div className={styles.button}>
          <a href="/settings">設定</a>
        </div>
      </div>
    );
  }
}
