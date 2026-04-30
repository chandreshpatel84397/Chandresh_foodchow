"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Category {
  categoryId: number;
  categoryName: string;
}

export default function AddItemPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState(1);
  const [type, setType] = useState("VEG");
  const [halalType, setHalalType] = useState("");
  const [hasVariant, setHasVariant] = useState(false);

  const [isAlcohol, setIsAlcohol] = useState(false);

  const [price, setPrice] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (itemName.trim() === "" || description.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill required fields",
      });
      return;
    }

    const payload = {
      cate_id: selectedCategory === "" ? 101 : selectedCategory,
      item_name: itemName,
      description: description,
      item_image: image ? image.name : null,
      status: status,
      is_alcohol: isAlcohol ? 1 : 0,
      is_veg: type === "VEG" ? 1 : 0,
      non_veg_type: type === "NON-VEG" ? 1 : 0,
      is_custom: hasVariant ? 1 : 0,
      item_code: itemName.substring(0, 3).toUpperCase() + "001",
      price: price ? Number(price) : 0
    };

    console.log("Sending payload:", payload);

    try {
      const res = await fetch(
        "https://localhost:44376/api/FoodItem/insert-item",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.error(err);

        Swal.fire({
          icon: "error",
          title: "Insert Failed ❌",
          text: "Something went wrong while adding item",
        });

        return;
      }

      const result = await res.json();
      console.log(result);
      console.log(status);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Item Added Successfully ✅",
      });

      setItemName("");
      setDescription("");
      setImage(null);
      setPreview(null);
      setSelectedCategory("");
      setStatus(1);
      setType("VEG");
      setHalalType("");
      setHasVariant(false);
      setIsAlcohol(false);
      setPrice("");
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
        <h2 className={styles.title}>Add New Item</h2>

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
          </div>

          <div className={styles.imageBox}>
            <p>Choose Image</p>

            <div className={styles.imagePlaceholder}>
              {preview ? (
                <img src={preview} style={{ width: "100%" }} />
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

        <label>Price *</label>
        <input
          className={styles.input}
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
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
                type="button"
                className={status === 1 ? styles.active : ""}
                onClick={() => setStatus(1)}
              >
                ACTIVE
              </button>

              <button
                type="button"
                className={status === 0 ? styles.active : ""}
                onClick={() => setStatus(0)}
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
          <button className={styles.add} onClick={handleSubmit}>
            ADD
          </button>
        </div>
      </div>

      <div className={styles.buttons}>
        <button
          className={styles.add}
          onClick={() => router.push("/Items")}
        >
          BACK
        </button>
      </div>
    </div>
  );
}