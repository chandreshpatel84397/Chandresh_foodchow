"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Swal from "sweetalert2";

interface FoodPreference {
  preference_id: number;
  preference_name: string;
  is_active: number;
  option_name: string[];
}

export default function DisplayFoodPreference() {
  const [data, setData] = useState<FoodPreference[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch(
        "https://localhost:44376/api/FoodPreference/get"
      );

      if (!response.ok) {
        Swal.fire("Error", await response.text(), "error");
        return;
      }

      const result = await response.json();
      setData(result);
    } catch {
      Swal.fire("Error", "Server not reachable", "error");
    } finally {
      setLoading(false);
    }
  }

  /* ================= DELETE ================= */
  async function deletePreference(preferenceId: number) {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this food preference?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#11b5a4",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(
        `https://localhost:44376/api/FoodPreference/delete/${preferenceId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        Swal.fire("Error!", "Delete failed.", "error");
        return;
      }

      Swal.fire("Deleted!", "Food preference has been deleted.", "success");

      setData((prev) =>
        prev.filter((item) => item.preference_id !== preferenceId)
      );
    } catch {
      Swal.fire("Error", "Server not reachable", "error");
    }
  }

  /* ================= TOGGLE ================= */
  async function toggleStatus(item: FoodPreference) {
    const newStatus = item.is_active === 1 ? 0 : 1;

    try {
      const response = await fetch(
        `https://localhost:44376/api/FoodPreference/update/${item.preference_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            preference_id: item.preference_id,
            preference_name: item.preference_name,
            is_active: newStatus,
            option_name: item.option_name,
          }),
        }
      );

      if (!response.ok) {
        Swal.fire("Error", await response.text(), "error");
        return;
      }

      setData((prev) =>
        prev.map((p) =>
          p.preference_id === item.preference_id
            ? { ...p, is_active: newStatus }
            : p
        )
      );
    } catch {
      Swal.fire("Error", "Server not reachable", "error");
    }
  }

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      {/* ================= HEADER ================= */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Choices</h2>
          <p className={styles.subtitle}>
            (Mild, Medium, Hot) [This will not have a price.]
          </p>
        </div>

        <div className={styles.headerActions}>
          <Link href="/insert" className={styles.linkReset}>
            <button className={styles.addBtn}>+ ADD NEW CHOICE</button>
          </Link>

          <button
            className={styles.helpBtn}
            onClick={() =>
              Swal.fire(
                "Choices Help",
                "Choices are options like Mild, Medium, Hot that do not affect the price.",
                "info"
              )
            }
          >
            HELP
          </button>
        </div>
      </div>

      {/* ================= TABLE HEADER ================= */}
      <div className={styles.tableHeader}>
        <span>Choices Name</span>
        <span>Action</span>
      </div>

      {/* ================= DATA ================= */}
      {data.length === 0 ? (
        <p className={styles.noData}>No data found</p>
      ) : (
        <div className={styles.list}>
          {data.map((item) => (
            <div key={item.preference_id} className={styles.row}>
              <div className={styles.choiceName}>
                {item.preference_name}
              </div>

              <div className={styles.actions}>
                {/* EDIT */}
                <Link
                  href={`/update/${item.preference_id}`}
                  className={styles.linkReset}
                >
                  <button className={styles.editBtn}>✏️</button>
                </Link>

                {/* DELETE */}
                <button
                  className={styles.deleteBtn}
                  onClick={() => deletePreference(item.preference_id)}
                >
                  🗑️
                </button>

                {/* TOGGLE */}
                <div
                  className={`${styles.toggle} ${
                    item.is_active === 1 ? styles.active : ""
                  }`}
                  onClick={() => toggleStatus(item)}
                >
                  <span />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}