"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import styles from "./page.module.css";

export default function AddVariantPage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const API_URL = "https://localhost:44376/api/foodshopsize";

  const addVariant = async () => {

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
        title: "Adding...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const res = await fetch(`${API_URL}/insert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          size_name: name.trim(),
        }),
      });

      Swal.close();

      if (!res.ok) {
        Swal.fire("Error!", "Insert failed", "error");
        return;
      }

      await Swal.fire({
        title: "Added!",
        text: "Variant added successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });

      router.push("/variants");

    } catch (err) {
      Swal.fire("Error!", "Server error", "error");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>

        <h1 className={styles.title}>
          Add New Variant
        </h1>

        {/* Input */}
        <div>

          <label className={styles.label}>
            Variant Name <span className={styles.required}>*</span>
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            placeholder="Enter variant name"
          />

        </div>

        {/* Buttons */}
        <div className={styles.buttonGroup}>

          <button
            onClick={addVariant}
            className={styles.btn}
          >
            Add
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