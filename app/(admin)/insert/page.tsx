"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function Page() {
  const [foodpreference, setfoodpreference] = useState("");
  const [status, setstatus] = useState(1);
  const [options, setoptions] = useState("");

  const router = useRouter();

<div className="pagination">
  <button 
    className="previous"
    onClick={() => router.push("/previous-page")}
  >
    PREVIOUS
  </button>

  <button 
    className="next"
    onClick={() => router.push("/next-page")}
  >
    NEXT
  </button>
</div>

  async function submitform(e: React.FormEvent) {
    e.preventDefault();

const result1 = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to add this food preference?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!"
    });

    if (!result1.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(
        "https://localhost:44376/api/FoodPreference/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            preference_name: foodpreference,
            is_active: status,
            option_name: options
              .split(",")
              .map(o => o.trim())
              .filter(o => o.length > 0),
          }),
        }
      );

      if (!response.ok) {
        Swal.fire("Error!", "Insert failed.", "error");
        return;
      }


      Swal.fire("Added!", "Food preference has been added.", "success");
      
      setfoodpreference("");
      setstatus(1);
      setoptions("");
    } catch {
      alert("Server not reachable");
    }
  }

  return (
    <div>
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Add Food Preference</h2>

        <form onSubmit={submitform}>
          {/* Food Preference Name */}
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

          {/* Status */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Status
              <span className={styles.required}>*</span>
            </label>

            <div className={styles.statusGroup}>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="status"
                  checked={status === 1}
                  onChange={() => setstatus(1)}
                />
                Active
              </label>

              <label className={styles.radio}>
                <input
                  type="radio"
                  name="status"
                  checked={status === 0}
                  onChange={() => setstatus(0)}
                />
                Inactive
              </label>
            </div>
          </div>

          {/* Options */}
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
                placeholder="Option1, Option2, Option3"
                required
              />
              <button
                type="button"
                className={styles.addBtn}
                title="Options are comma separated"
              >
                + ADD
              </button>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className={styles.footer}>
            <button type="submit" className={styles.submitBtn}>
              ADD CATEGORY
            </button>

            <Link href="/display">
              <button type="button" className={styles.secondaryBtn}>
                VIEW FOOD PREFERENCES
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
    
    
<div className="pagination">
  <button 
    className="previous"
    onClick={() => router.push("/variants")}
  >
    PREVIOUS
  </button>

  <button 
    className="next"
    onClick={() => router.push("/extras-category/custom_category/show_category")}
  >
    NEXT
  </button>
</div>
    
    </div>


  );
}
