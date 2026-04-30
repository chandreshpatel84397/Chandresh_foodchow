"use client";

import styles from "./uploadMenu.module.css";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function UploadMenuExcel() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (ext !== "xls" && ext !== "xlsx") {
      Swal.fire("Invalid File", "Please upload only .xls or .xlsx files", "error");
      return;
    }
    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    handleFileChange(dropped);
  };

const handleUpload = async () => {
  if (!file) {
    Swal.fire("No File", "Please select file", "warning");
    return;
  }

  setIsUploading(true);

  try {
    const formData = new FormData();
    formData.append("file", file);

    //  HARDCODED BACKEND URL (FINAL FIX)
    const url = "https://localhost:44376/api/MenuUpload/upload-excel?shopId=1";

    console.log("STEP 1: file =", file);

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });
    console.log("STEP 2: response =", res);

    const text = await res.text();
    console.log("STEP 3: text =", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (err: any) {
  console.error("FULL ERROR ", err);

  alert(err?.message || JSON.stringify(err)); // raw error
}

    if (!res.ok) {
      throw new Error(data?.message || "Upload failed");
    }

    Swal.fire({
      title: "Upload Successful",
      html: `
        <b>Inserted:</b> ${data.inserted}<br/>
        <b>Total:</b> ${data.total}
      `,
      icon: "success",
    });

  } catch (err: any) {
    console.error("❌ ERROR:", err);

    Swal.fire({
      title: "Error",
      text: err.message,
      icon: "error",
    });
  } finally {
    setIsUploading(false);
  }
};

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div>
            <h1 className={styles.title}>Upload Menu</h1>
            <p className={styles.subtitle}>Import food items from Excel spreadsheet</p>
          </div>
        </div>

        {/* Step 1 */}
        <div className={styles.step}>
          <div className={styles.stepBadge}>1</div>
          <div className={styles.stepContent}>
            <h3>Download the sample template</h3>
            <p>
              Your Excel file must have these columns:
              <span className={styles.tag}>Category</span>
              <span className={styles.tag}>Item_Name</span>
              <span className={styles.tag}>Description</span>
              <span className={styles.tag}>Is_Veg(1:veg,0:non-veg)</span>
              <span className={styles.tag}>Is_Alcohol(1:alcoholic,0:no alcoholic)</span>
              <span className={styles.tag}>Price</span>
            </p>
            <button
              className={styles.downloadBtn}
              onClick={() => window.open("/menus_sample.xlsx")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Sample
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className={styles.step}>
          <div className={styles.stepBadge}>2</div>
          <div className={styles.stepContent}>
            <h3>Select your Excel file</h3>

            {/* Drop Zone */}
            <div
              className={`${styles.dropzone} ${isDragging ? styles.dragging : ""} ${file ? styles.hasFile : ""}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              {file ? (
                <div className={styles.filePreview}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" width="40" height="40">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <polyline points="9 15 11 17 15 13"/>
                  </svg>
                  <div className={styles.fileInfo}>
                    <span className={styles.fileName}>{file.name}</span>
                    <span className={styles.fileSize}>
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <button className={styles.removeBtn} onClick={(e) => { e.stopPropagation(); removeFile(); }}>
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48" className={styles.uploadIcon}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <p className={styles.dropText}>Drag & drop your file here</p>
                  <p className={styles.dropSubText}>or click to browse</p>
                  <span className={styles.fileTypes}>.xls, .xlsx only</span>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xls,.xlsx"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        {/* Upload Button */}
        <button
          className={styles.uploadBtn}
          onClick={handleUpload}
          disabled={isUploading || !file}
        >
          {isUploading ? (
            <>
              <span className={styles.spinner} />
              Uploading...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload & Save
            </>
          )}
        </button>
      </div>
    </div>
  );
}