"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import styles from "./page.module.css";

interface Variant {
  id: number;
  size_name: string;
}

export default function VariantsPage() {
  const [variants, setVariants] = useState<Variant[]>([]);
  const router = useRouter();
const [showHelp, setShowHelp] = useState(false);
  const API_URL = "https://localhost:44376/api/FoodShopSize";

  const loadVariants = async () => {
    const res = await fetch(`${API_URL}/getall`);
    const data = await res.json();
    setVariants(data);
  };

  const deleteVariant = async (id: number) => {

  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This variant will be deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#14b8a6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch(`${API_URL}/delete/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      Swal.fire("Error!", "Delete failed", "error");
      return;
    }

    Swal.fire("Deleted!", "Variant removed successfully.", "success");

    loadVariants();

  } catch (err) {
    Swal.fire("Error!", "Server error", "error");
  }
};




  useEffect(() => {
    loadVariants();
  }, []);

  return (
    
    <div className={styles.pageWrapper}>

      <div className={styles.card}>

        {/* Header */}
        <div className={styles.header}>

          <div>
            <h1 className={styles.title}>
  Variants
</h1>

            <p className={styles.subtitle}> 
              (Large, Medium, Small, Half, Full)
            </p>
          </div>

          <div className={styles.headerActions}>
  <button
    onClick={() => router.push("/variants/add")}
    className={styles.addBtn}
  >
    + ADD NEW VARIANT
  </button>

  <button
    className={styles.helpBtn}
    onClick={() => setShowHelp(true)}
  >
    ❤️ HELP
  </button>
</div>

        </div>

        {/* List */}
        <div className={styles.grid}>

          {variants.map((v) => (
            <div
              key={v.id}
              className={styles.variantCard}
            >
              <span className={styles.variantText}>
                {v.size_name}
              </span>

              <div className={styles.actions}>

                {/* Edit  */}
                <button
  onClick={() => router.push(`/variants/edit?id=${v.id}`)}
  className={styles.editBtn}>
  ✏️
</button>

                {/* Delete */}
                <button
                  onClick={() => deleteVariant(v.id)}
                  className={styles.deleteBtn}>
                  🗑
                </button>

              </div>
            </div>
          ))}

        </div>

      </div>


      {showHelp && (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <button
            className={styles.closeBtn}
            onClick={() => setShowHelp(false)}
          >
            Close
          </button>

          <iframe
            src="https://player.vimeo.com/video/1075943743"
            width="100%"
            height="400"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    )}

  
<div className={styles.pagination}>
  <button 
    className={styles.previous}
    onClick={() => router.push("/inside_folder/category")}
  >
    PREVIOUS
  </button>

  <button 
    className={styles.next}
    onClick={() => router.push("/insert")}
  >
    NEXT
  </button>
</div>
    </div>
  );
}
