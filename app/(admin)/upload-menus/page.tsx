"use client";

import { useRouter } from "next/navigation";
import styles from "./uploadmenus.module.css";
import { useState } from "react";

export default function UploadMenus() {
  const router = useRouter();
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* HELP BUTTON */}
        <button
          className={styles.helpBtn}
          onClick={() => setShowVideo(true)}
        >
          HELP
        </button>

        <h2>Upload Excel</h2>

        <p>
          Do you want to upload your menu with an excel sheet or enter it
          manually item wise ?
        </p>

        <div className={styles.buttonGroup}>
          <button
            className={styles.excelBtn}
            onClick={() => router.push("/upload-menu")}
          >
            WITH EXCEL
          </button>

          <button
            className={styles.manualBtn}
            onClick={() => router.push("/inside_folder/category")}
          >
            MANUALLY
          </button>
        </div>
      </div>

      {/* VIDEO MODAL */}
      {showVideo && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button
              className={styles.closeBtn}
              onClick={() => setShowVideo(false)}
            >
              Close
            </button>

            <iframe
              src="https://player.vimeo.com/video/1075943208"
              width="100%"
              height="400"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}