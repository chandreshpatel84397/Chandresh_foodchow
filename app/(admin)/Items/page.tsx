"use client";

import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import Swal from "sweetalert2";
import Cropper from "react-easy-crop";

// ✅ helper to get cropped image blob
async function getCroppedImg(imageSrc: string, croppedAreaPixels: any): Promise<Blob> {
  const image = await createImageBitmap(await (await fetch(imageSrc)).blob());
  const canvas = document.createElement("canvas");
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob!), "image/jpeg"));
}

export default function ItemsPage() {
  const router = useRouter();

  interface Item {
    item_id: number;
    item_name: string;
    price: number;
    item_image: string | null;
    is_active: boolean;
  }

  const [items, setItems] = useState<Item[]>([]);
  const [searchText, setSearchText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // ✅ crop states
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [originalFileName, setOriginalFileName] = useState("");

  // Fetch all items on load
  useEffect(() => {
    fetch("https://localhost:44376/api/FoodItem/get-item-list")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setItems(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // ✅ ADD IMAGE FUNCTION
  const handleAddImage = (item_id: number) => {
    setSelectedItemId(item_id);
    fileInputRef.current?.click();
  };

  // ✅ FILE SELECTED - open crop dialog instead of uploading directly
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || selectedItemId === null) return;

    const imageUrl = URL.createObjectURL(file);
    setRawImageSrc(imageUrl);
    setOriginalFileName(file.name);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropDialogOpen(true); // ✅ open crop dialog

    e.target.value = "";
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // ✅ UPLOAD CROPPED IMAGE
  const handleCropConfirm = async () => {
    if (!rawImageSrc || !croppedAreaPixels || selectedItemId === null) return;

    try {
      const croppedBlob = await getCroppedImg(rawImageSrc, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], originalFileName, { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("image", croppedFile);

      const res = await fetch(
        `https://localhost:44376/api/FoodItem/update-item-image/${selectedItemId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        Swal.fire({ icon: "error", title: "Failed ❌", text: "Image upload failed" });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Uploaded!",
        text: "Image added successfully ✅",
        timer: 1200,
        showConfirmButton: false,
      });

      setItems((prev) =>
        prev.map((item) =>
          item.item_id === selectedItemId
            ? { ...item, item_image: originalFileName }
            : item
        )
      );

    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error ❌", text: "Something went wrong" });
    }

    // ✅ close dialog and reset
    setCropDialogOpen(false);
    setRawImageSrc(null);
    setSelectedItemId(null);
  };

  // ✅ CANCEL CROP
  const handleCropCancel = () => {
    setCropDialogOpen(false);
    setRawImageSrc(null);
    setSelectedItemId(null);
  };

  // ✅ SEARCH FUNCTION (UNCHANGED)
  const handleSearch = async (value: string) => {
    setSearchText(value);

    if (value.trim() === "") {
      fetch("https://localhost:44376/api/FoodItem/get-item-list")
        .then((res) => res.json())
        .then((data) => setItems(data))
        .catch((err) => console.error(err));
      return;
    }

    try {
      const res = await fetch(
        `https://localhost:44376/api/FoodItem/get-item-by-name?itemName=${encodeURIComponent(value)}`
      );

      if (!res.ok) {
        setItems([]);
        return;
      }

      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 DELETE FUNCTION (UNCHANGED)
  const handleDelete = async (id: number) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "This item will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const res = await fetch(
        `https://localhost:44376/api/FoodItem/delete/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        Swal.fire({ icon: "error", title: "Delete Failed ❌", text: "Something went wrong while deleting item" });
        return;
      }

      Swal.fire({ icon: "success", title: "Deleted!", text: "Item deleted successfully ✅" });
      setItems((prev) => prev.filter((item) => item.item_id !== id));
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error ❌", text: "Something went wrong" });
    }
  };

  // ✅ TOGGLE FUNCTION (UNCHANGED)
  const handleToggle = async (id: number) => {
    try {
      const res = await fetch(
        `https://localhost:44376/api/FoodItem/toggle-status/${id}`,
        { method: "POST" }
      );

      if (!res.ok) {
        Swal.fire({ icon: "error", title: "Failed ❌", text: "Status update failed" });
        return;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.item_id === id ? { ...item, is_active: !item.is_active } : item
        )
      );

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Status toggled successfully ✅",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error ❌", text: "Something went wrong" });
    }
  };

  return (
    <div>
    <div className={styles.container}>
    <div className={styles.card}>
      {/* Top Section */}
      <div className={styles.topBar}>
        <h2>Items</h2>
      
        <div className={styles.topActions}>
          <button className={styles.addBtn} onClick={() => router.push("/Item_Add")}>
            + ADD NEW ITEM
          </button>
          <button className={styles.helpBtn}>HELP</button>
        </div>
      </div>

      {/* Quick Edit */}
      <button className={styles.quickBtn}>QUICK EDIT</button>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* ✅ CROP DIALOG */}
      {cropDialogOpen && rawImageSrc && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.8)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {/* Crop Area */}
          <div style={{ position: "relative", width: "400px", height: "400px", background: "#333" }}>
            <Cropper
              image={rawImageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* Zoom Slider */}
          <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ color: "white" }}>Zoom:</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ width: "200px" }}
            />
            <span style={{ color: "white" }}>{zoom.toFixed(1)}x</span>
          </div>

          {/* Buttons */}
          <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
            <button
              onClick={handleCropConfirm}
              style={{
                padding: "10px 28px",
                backgroundColor: "#00b894",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              ✅ Confirm
            </button>
            <button
              onClick={handleCropCancel}
              style={{
                padding: "10px 28px",
                backgroundColor: "#d63031",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table Card */}
      <div className={styles.card}>
        {/* Search */}
        <div className={styles.searchBar}>
          <span>Search:</span>
          <input
            type="text"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by item name..."
          />
        </div>

        {/* Table */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Item Name</th>
              <th>Item Price</th>
              <th>Image</th>
              <th>Add Image</th>
              <th>Edit</th>
              <th>Delete</th>
              <th>Active/DeActive</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center" }}>No items found</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.item_id}>
                  <td>☰</td>
                  <td>{item.item_name}</td>
                  <td>Rs.{item.price}</td>

                  <td>
                    {item.item_image ? (
                      <img
                        src={`https://localhost:44376/images/${item.item_image}`}
                        alt={item.item_name}
                        width={50}
                        height={50}
                        style={{ objectFit: "cover", borderRadius: "6px" }}
                      />
                    ) : (
                      <div className={styles.imgBox}>No image</div>
                    )}
                  </td>

                  <td>
                    <button
                      className={styles.circleBtn}
                      onClick={() => handleAddImage(item.item_id)}
                    >
                      +
                    </button>
                  </td>

                  <td>
                    <button
                      className={styles.circleBtn}
                      onClick={() => router.push(`/Item_Edit/${item.item_id}`)}
                    >
                      ✏️
                    </button>
                  </td>

                  <td>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(item.item_id)}
                    >
                      🗑
                    </button>
                  </td>

                  <td>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={item.is_active}
                        onChange={() => handleToggle(item.item_id)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
       </div>
  </div>



<div className={styles.pagination}>
  <button 
    className={styles.previous}
    onClick={() => router.push("/extras")}
  >
    PREVIOUS
  </button>

  <button 
    className={styles.next}
    onClick={() => router.push("/Item_Code")}
  >
    NEXT
  </button>
</div>
  </div>
  );
}