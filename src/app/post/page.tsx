"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useState } from "react";
import { useAuth } from "../context/authContext";
import { db } from "../lib/firebase";
import { addDoc, collection } from "firebase/firestore";

import styles from "./page.module.scss";
import { Input, Upload, DatePicker, UploadFile, Button } from "antd";
import dayjs, { Dayjs } from "dayjs";

const { TextArea } = Input;

export default function Post() {
  // アクセス権チェック
  const { currentUser, loading } = useAuth();

  // プログレスバー
  const [progress, setProgress] = useState(0);

  // フォーム情報の状態管理
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [dateTime, setDateTime] = useState<Dayjs>(dayjs());
  const [comment, setComment] = useState("");

  const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };
  const handleDateTimeChange = (value: Dayjs) => {
    setDateTime(value);
  };
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  // 認証ロード中の処理
  if (loading) {
    return (
      <div className={styles.post}>
        <p>認証状態を確認中...</p>
      </div>
    );
  }

  // 未ログイン時の処理
  if (!currentUser) {
    return (
      <div className={styles.post}>
        未ログインです。<a href="/">トップに戻る</a>
      </div>
    );
  }

  // ImageKitアップロード関連
  const abortController = new AbortController();
  const authenticator = async () => {
    try {
      // Perform the request to the upload authentication endpoint.
      const response = await fetch("/api/upload-auth");
      if (!response.ok) {
        // If the server response is not successful, extract the error text for debugging.
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`,
        );
      }

      // Parse and destructure the response JSON for upload credentials.
      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      // Log the original error for debugging before rethrowing a new error.
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  // ImageKitへのアップロード処理
  const fileUpload = async () => {
    const fileInput = fileList;
    if (!fileInput || fileInput.length === 0) {
      alert("Please select a file to upload");
      return;
    }
    const files = fileList
      .map((file) => file.originFileObj)
      .filter(Boolean) as File[];
    const file = files[0];

    // Retrieve authentication parameters for the upload.
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return;
    }
    const { signature, expire, token, publicKey } = authParams;

    // Call the ImageKit SDK upload function with the required parameters and callbacks.
    try {
      const uploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: "upload",
        // Progress callback to update upload progress state
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        // Abort signal to allow cancellation of the upload if needed.
        abortSignal: abortController.signal,
      });
      // console.log("Upload response:", uploadResponse);
      return uploadResponse;
    } catch (error) {
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        // Handle any other errors that may occur.
        console.error("Upload error:", error);
      }
      return { error: error };
    }
  };

  // Firestore DBへのアップロード
  const dataUpload = async (filedata: Object) => {
    try {
      const reFiledata = filedata as { url: string };
      // Firestore にデータを追加
      const docRef = await addDoc(collection(db, "posts"), {
        timestamp: new Date(),
        date: dateTime.toISOString(),
        comment: comment,
        imageUrl: reFiledata.url,
      });

      // フォームをクリア
      setFileList([]);
      setDateTime(dayjs());
      setComment("");
      setProgress(0);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // アップロード押下時
  const handleUpload = async () => {
    const fileData = await fileUpload();
    if (fileData) {
      dataUpload(fileData);
    }
  };

  return (
    <div className={styles.post}>
      <form>
        <div>
          <Upload
            listType="picture-card"
            maxCount={1}
            accept=".jpg, .jpeg, .png"
            fileList={fileList}
            onChange={handleFileChange}
          >
            + ごはん
          </Upload>
        </div>
        <div>
          <DatePicker
            onChange={handleDateTimeChange}
            name="date"
            showTime
            defaultValue={dayjs()}
            format={"YYYY/MM/DD HH時"}
          ></DatePicker>
        </div>
        <div>
          <TextArea
            className={styles.commentForm}
            onChange={handleCommentChange}
            value={comment}
            placeholder="コメント"
            name="comment"
            rows={3}
            showCount
          ></TextArea>
        </div>
        <Button color="default" variant="solid" onClick={handleUpload}>
          投稿
        </Button>
        Upload progress: <progress value={progress} max={100}></progress>
      </form>
    </div>
  );
}
