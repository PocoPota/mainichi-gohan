"use client";

type Props = {
  isLogin: boolean;
};

export default function PostButtons(props: Props) {
  if (props.isLogin) {
    return (
      <div>
        <div>
          <a href="/post">投稿</a>
        </div>
        <div>
          <a href="/settings">設定</a>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <a href="/settings">設定</a>
      </div>
    );
  }
}
