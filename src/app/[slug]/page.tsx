// app/posts/[id]/page.tsx
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

import styles from "./page.module.scss";

type PageProps = {
  params: { slug: string };
};

export default async function OnePost({ params }: PageProps) {
  const docRef = doc(db, "posts", params.slug);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return <div>Not Found</div>;
  }

  const post = docSnap.data();

  return (
    <div className={styles.onePost}>
      <ul>
        <li>
          <img src={post.imageUrl}></img>
        </li>
        <li>日時：{post.date}</li>
        <li>{post.comment}</li>
      </ul>
    </div>
  );
}
