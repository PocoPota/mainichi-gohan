"use client"; // This component must be a client component

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState } from "react";
import { useAuth } from "../context/authContext";
import { db } from "../lib/firebase";
import { addDoc, collection } from "firebase/firestore";

import styles from "./page.module.scss";
import {
  Input,
  ConfigProvider,
  Upload,
  DatePicker,
  TimePicker,
  DatePickerProps,
  TimePickerProps,
  UploadFile,
} from "antd";
import dayjs, { Dayjs } from "dayjs";

// UploadExample component demonstrates file uploading using ImageKit's Next.js SDK.
export default function Post() {
  // アクセス権チェック
  const { currentUser, loading } = useAuth();

  // State to keep track of the current upload progress (percentage)
  const [progress, setProgress] = useState(0);

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [dateTime, setDateTime] = useState<Dayjs>(dayjs());

  // Create an AbortController instance to provide an option to cancel the upload if needed.
  const abortController = new AbortController();

  // firestore用
  const [inputValue, setInputValue] = useState({
    date: "",
    comment: "",
  });

  // 入力値更新
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  const handleDateTimeChange = (value: Dayjs) => {
    setDateTime(value);
  };

  // 認証状態のロード中は何も表示しないか、ローディング表示
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

  /**
   * Authenticates and retrieves the necessary upload credentials from the server.
   *
   * This function calls the authentication API endpoint to receive upload parameters like signature,
   * expire time, token, and publicKey.
   *
   * @returns {Promise<{signature: string, expire: string, token: string, publicKey: string}>} The authentication parameters.
   * @throws {Error} Throws an error if the authentication request fails.
   */
  const authenticator = async () => {
    try {
      // Perform the request to the upload authentication endpoint.
      const response = await fetch("/api/upload-auth");
      if (!response.ok) {
        // If the server response is not successful, extract the error text for debugging.
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
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

  /**
   * Handles the file upload process.
   *
   * This function:
   * - Validates file selection.
   * - Retrieves upload authentication credentials.
   * - Initiates the file upload via the ImageKit SDK.
   * - Updates the upload progress.
   * - Catches and processes errors accordingly.
   */
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

  const dataUpload = async (filedata: Object) => {
    // ここにFirestoreアップロード処理
    console.log(inputValue);
    console.log(filedata);
    console.log(dateTime);
    

    try {
      const reFiledata = filedata as { url: string };
      // Firestore にデータを追加
      const docRef = await addDoc(collection(db, "posts"), {
        timestamp: new Date(),
        // date: inputValue.date,
        date: dateTime.toISOString(),
        comment: inputValue.comment,
        imageUrl: reFiledata.url,
      });
      console.log("Document written with ID: ", docRef.id);

      // フォームをクリア
      setFileList([]);
      setDateTime(dayjs());
      setInputValue({
        date: "",
        comment: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleUpload = async () => {
    const fileData = await fileUpload();
    console.log(fileData);
    if (fileData) {
      dataUpload(fileData);
    }
  };

  // デザインデータ
  const { TextArea } = Input;

  return (
    <div className={styles.post}>
      <form>
        <div>
          <label>ごはん画像</label>
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
          <label>日時</label>
          <DatePicker
            onChange={handleDateTimeChange}
            name="date"
            showTime
            defaultValue={dayjs()}
            format={"YYYY/MM/DD HH時"}
          ></DatePicker>
        </div>
        <div>
          <label>コメント</label>
          <TextArea
            onChange={handleInputChange}
            value={inputValue.comment}
            placeholder="コメント"
            name="comment"
            rows={3}
            showCount
          ></TextArea>
        </div>
        <input type="button" onClick={handleUpload} value="投稿"></input>
        <br />
        Upload progress: <progress value={progress} max={100}></progress>
      </form>
    </div>
  );
}
