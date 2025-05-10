import styles from "./Loading.module.scss"

export default function Loading() {
  return (
    <div className={styles.loading}>
      <img src="/loading.gif"></img>
      <p>Loading...</p>
    </div>
  );
}
