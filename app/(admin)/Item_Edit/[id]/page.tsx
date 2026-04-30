"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";

interface Category {
  categoryId: number;
  categoryName: string;
}

export default function AddItemPage() {
  const router = useRouter();

  const params = useParams();
  const id = params.id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState("ACTIVE");
  const [type, setType] = useState("VEG");
  const [halalType, setHalalType] = useState("");
  const [hasVariant, setHasVariant] = useState(false);

  const [isAlcohol, setIsAlcohol] = useState(false);

  const [price, setPrice] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // 🔹 Fetch categories
  useEffect(() => {
    fetch("https://localhost:44376/api/FoodCategory/getall")
      .then(async (res) => {
        if (res.status === 204) return [];
        const text = await res.text();
        return text ? JSON.parse(text) : [];
      })
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, []);

  // 🔥 Fetch item by ID (EDIT PREFILL)
  useEffect(() => {
    if (!id) return;

    fetch(`https://localhost:44376/api/FoodItem/get-item/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Edit Data:", data);

        setItemName(data.item_name || "");
        setDescription(data.description || "");
        setPrice(data.price ? String(data.price) : "");

        setSelectedCategory(data.cate_id || "");

        setIsAlcohol(data.is_alcohol === 1); // ✅ reflects is_alcohol

        setHasVariant(data.is_custom === 1);

        setType(data.is_veg === 1 ? "VEG" : "NON-VEG"); // ✅ reflects is_veg

        if (data.non_veg_type === 1) setHalalType("HALAL"); // ✅ reflects non_veg_type
        else if (data.non_veg_type === 2) setHalalType("NON_HALAL");

        // ✅ reflects status
        setStatus(data.status === 1 ? "ACTIVE" : "DEACTIVE");

        // ✅ reflects item_image
        if (data.item_image) {
          setPreview(
            `https://localhost:44376/images/${data.item_image}`
          );
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  // 🔹 Image preview
  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔥 UPDATE FUNCTION (UNCHANGED)
  const handleUpdate = async () => {
    const payload = {
      item_id: id,

      cate_id: selectedCategory === "" ? 101 : selectedCategory,

      item_name: itemName,
      description: description,

      item_image: image ? image.name : preview,

      status: status === "ACTIVE" ? 1 : 0,

      is_alcohol: isAlcohol ? 1 : 0,

      is_veg: type === "VEG" ? 1 : 0,

      non_veg_type:
        type === "NON-VEG"
          ? halalType === "HALAL"
            ? 1
            : 2
          : 0,

      is_custom: hasVariant ? 1 : 0,

      item_code: itemName.substring(0, 3).toUpperCase() + "001",

      price: price ? Number(price) : 0,
    };

    try {
      const res = await fetch(
        `https://localhost:44376/api/FoodItem/update-item/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Update Failed ❌",
          text: "Something went wrong while updating item",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Updated Successfully",
        text: "Item has been updated successfully ✅",
      });

      router.push("/Items");
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Error ❌",
        text: "Something went wrong",
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Edit Item</h2>

        <div className={styles.row}>
          <div className={styles.col}>
            <label>Category *</label>
            <select
              className={styles.input}
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>

            <label>Item Name *</label>
            <input
              className={styles.input}
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />

            <label>Price *</label>
            <input
              className={styles.input}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className={styles.imageBox}>
            <p>Choose Image</p>

            <div className={styles.imagePlaceholder}>
              {preview ? (
                <img src={preview} style={{ width: "100%" }} /> // ✅ now shows actual image from server
              ) : (
                "No Image"
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              id="fileInput"
              hidden
              onChange={handleImageChange}
            />

            <button
              type="button"
              className={styles.uploadBtn}
              onClick={() =>
                document.getElementById("fileInput")?.click()
              }
            >
              UPLOAD IMAGE
            </button>
          </div>
        </div>

        <label>Description</label>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className={styles.checkbox}>
          <input
            type="checkbox"
            checked={hasVariant}
            onChange={(e) => setHasVariant(e.target.checked)}
          />
          <span>Contain Variant</span>
        </div>

        <div className={styles.row}>
          <div className={styles.box}>
            <label>Status</label>

            <div className={styles.toggle}>
              <button
                className={status === "ACTIVE" ? styles.active : ""}
                onClick={() => setStatus("ACTIVE")}
              >
                ACTIVE
              </button>

              <button
                className={status === "DEACTIVE" ? styles.active : ""}
                onClick={() => setStatus("DEACTIVE")}
              >
                DEACTIVE
              </button>
            </div>

            <div className={styles.checkbox}>
              <input
                type="checkbox"
                checked={isAlcohol}
                onChange={(e) => setIsAlcohol(e.target.checked)}
              />
              <span>Contains Alcohol</span>
            </div>
          </div>

          <div className={styles.box}>
            <label>Type</label>

            <div className={styles.toggle}>
              <button
                className={type === "VEG" ? styles.active : ""}
                onClick={() => setType("VEG")}
              >
                VEG
              </button>

              <button
                className={type === "NON-VEG" ? styles.active : ""}
                onClick={() => setType("NON-VEG")}
              >
                NON-VEG
              </button>
            </div>

            {type === "NON-VEG" && (
              <div className={styles.radioGroup}>
                <label>
                  <input
                    type="radio"
                    value="HALAL"
                    checked={halalType === "HALAL"}
                    onChange={(e) => setHalalType(e.target.value)}
                  />
                  Halal
                </label>

                <label>
                  <input
                    type="radio"
                    value="NON_HALAL"
                    checked={halalType === "NON_HALAL"}
                    onChange={(e) => setHalalType(e.target.value)}
                  />
                  Non-Halal
                </label>
              </div>
            )}
          </div>
        </div>

        <div className={styles.buttons}>
          <button className={styles.add} onClick={handleUpdate}>
            UPDATE
          </button>
        </div>
      </div>

      <div className={styles.buttons}>
        <button className={styles.add} onClick={() => router.push("/Items")}>
          BACK
        </button>
      </div>
    </div>
  );
}