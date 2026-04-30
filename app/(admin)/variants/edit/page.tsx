"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import styles from "./page.module.css";

export default function EditVariantPage() {

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  const [name, setName] = useState("");

  const API_URL = "https://localhost:44376/api/FoodShopSize";

  const loadVariant = async () => {
    const res = await fetch(`${API_URL}/${id}`);
    const data = await res.json();
    setName(data.size_name);
  };

  const updateVariant = async () => {

    if (!name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please enter variant name",
        confirmButtonColor: "#14b8a6"
      });
      return;
    }

    try {

      Swal.fire({
        title: "Updating...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const res = await fetch(`${API_URL}/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: id,
          size_name: name.trim()
        })
      });

      Swal.close();

      if (!res.ok) {
        Swal.fire("Error!", "Update failed", "error");
        return;
      }

      await Swal.fire({
        title: "Updated!",
        text: "Variant updated successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });

      router.push("/variants");

    } catch (err) {
      Swal.fire("Error!", "Server error", "error");
    }
  };

  useEffect(() => {
    if (id) loadVariant();
  }, [id]);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>

        <h1 className={styles.title}>
          Edit Variant
        </h1>

        <label className={styles.label}>
          Variant Name <span className={styles.required}>*</span>
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />

        <div className={styles.buttonGroup}>

          <button
            onClick={updateVariant}
            className={styles.btn}
          >
            Update
          </button>

          <button
            onClick={() => router.push("/variants")}
            className={styles.cancelBtn}
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
}