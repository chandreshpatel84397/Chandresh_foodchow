"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import Swal from "sweetalert2";

interface FoodPreference {
  preference_id: number;
  preference_name: string;
  is_active: number;
  option_name: string[];
}

export default function Page() {
  const { id } = useParams();
  const router = useRouter();

  const [foodpreference, setfoodpreference] = useState("");
  const [status, setstatus] = useState(1);
  const [options, setoptions] = useState("");
  const [loading, setloading] = useState(true);

  /* ================= FETCH & PREFILL ================= */
  useEffect(() => {
    if (id) fetchPreference();
  }, [id]);

  async function fetchPreference() {
    try {
      const response = await fetch(
        "https://localhost:44376/api/FoodPreference/get"
      );

      if (!response.ok) {
        Swal.fire("Error", "Failed to load data", "error");
        return;
      }

      const result: FoodPreference[] = await response.json();

      const data = result.find(
        (item) => item.preference_id === Number(id)
      );

      if (!data) {
        Swal.fire("Error", "Record not found", "error");
        return;
      }

      // ✅ PREFILL FORM
      setfoodpreference(data.preference_name);
      setstatus(data.is_active);
      setoptions(data.option_name.join(", "));
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Server not reachable", "error");
    } finally {
      setloading(false);
    }
  }

  /* ================= UPDATE ================= */
  async function submitform(e: React.FormEvent) {
    e.preventDefault();

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update this food preference?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(
        `https://localhost:44376/api/FoodPreference/update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            preference_id: Number(id),
            preference_name: foodpreference,
            is_active: status,
            option_name: options
              .split(",")
              .map((o) => o.trim())
              .filter(Boolean),
          }),
        }
      );

      if (!response.ok) {
        Swal.fire("Error!", "Update failed.", "error");
        return;
      }

      await Swal.fire(
        "Updated!",
        "Food preference updated successfully.",
        "success"
      );

      router.push("/display");
    } catch {
      Swal.fire("Error", "Server not reachable", "error");
    }
  }

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Update Food Preference</h2>

        <form onSubmit={submitform}>
          {/* NAME */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Food Preference Name
              <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.input}
              value={foodpreference}
              onChange={(e) => setfoodpreference(e.target.value)}
              required
            />
          </div>

          {/* STATUS */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Status
              <span className={styles.required}>*</span>
            </label>

            <div className={styles.statusGroup}>
              <label className={styles.radio}>
                <input
                  type="radio"
                  checked={status === 1}
                  onChange={() => setstatus(1)}
                />
                Active
              </label>

              <label className={styles.radio}>
                <input
                  type="radio"
                  checked={status === 0}
                  onChange={() => setstatus(0)}
                />
                Inactive
              </label>
            </div>
          </div>

          {/* OPTIONS */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Options
              <span className={styles.required}>*</span>
            </label>

            <div className={styles.optionRow}>
              <input
                type="text"
                className={styles.input}
                value={options}
                onChange={(e) => setoptions(e.target.value)}
                placeholder="Option1, Option2"
                required
              />
              <button type="button" className={styles.addBtn}>
                + ADD
              </button>
            </div>
          </div>

          {/* FOOTER */}
          <div className={styles.footer}>
            <button type="submit" className={styles.submitBtn}>
              UPDATE CATEGORY
            </button>

            <Link href="/display">
              <button type="button" className={styles.secondaryBtn}>
                BACK
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}