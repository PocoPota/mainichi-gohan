"use client";

import styles from "./ContentsGrid.module.scss";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore"; // getDocs をインポート'
import { db } from "../lib/firebase";
import Loading from "./Loading";

interface Item {
  comment: string;
  date: string;
  id: string;
  imageUrl: string;
}

export default function ContentsGrid() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // 'items' コレクションへの参照を作成
        const querySnapshot = await getDocs(
          query(collection(db, "posts"), orderBy("date", "desc")),
        );

        // 取得したドキュメントを加工してStateに格納
        const itemsList: Item[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Item, "id">), // ドキュメントデータをItem型にキャスト
        }));
        setItems(itemsList);
      } catch (err) {
        console.error("Error fetching items: ", err);
        setError("アイテムの取得に失敗しました。"); // エラーメッセージ
      } finally {
        setLoading(false); // 読み込み完了
      }
    };

    fetchItems();
  }, []); // 空の依存配列により、コンポーネメントのマウント時に一度だけ実行

  if (loading) {
    return <Loading />; // 読み込み中の表示
  }

  if (error) {
    return <p>エラー: {error}</p>;
  }

  console.log(items);
  return (
    <div className={styles.contents}>
      {items.length === 0 ? (
        <p>アイテムが見つかりませんでした。</p>
      ) : (
        <ul className={styles.contentsGrid}>
          {items.map((item) => (
            <li className={styles.item} key={item.id}>
              <div>
                <img src={item.imageUrl}></img>
              </div>
              {item.comment}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
