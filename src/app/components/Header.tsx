import Image from "next/image";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <a href="/">
        <div className={styles.header_inner}>
          <div className={styles.icon}>
            <Image
              src="/icon_square.png"
              alt="まいにちごはん ロゴマーク"
              width={70}
              height={70}
            />
          </div>
          <div className={styles.title}>まいにちごはん</div>
        </div>
      </a>
    </header>
  );
}
