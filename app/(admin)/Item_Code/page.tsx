"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function DisplayItemCode() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

const router = useRouter();
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch(
        "https://localhost:44376/api/FoodItem/get-item-names"
      );

      if (!response.ok) {
        Swal.fire("Error", await response.text(), "error");
        return;
      }

      const result = await response.json();

      const formatted = result.map((item: any) => ({
        item_id: item.item_id,
        item_name: item.item_name,
        item_code: item.item_code ?? "",
      }));

      setData(formatted);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Server not reachable", "error");
    } finally {
      setLoading(false);
    }
  }

  // INPUT CHANGE
  const handleChange = (id: number, value: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.item_id === id
          ? { ...item, item_code: value }
          : item
      )
    );
  };

  // CLICK EDIT
  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  // SAVE SINGLE ITEM
  const handleRowSave = async (item: any) => {
    try {
      if (!item.item_code || item.item_code.trim() === "") {
        Swal.fire("Error", "Item code cannot be empty", "error");
        return;
      }

      const response = await fetch(
        `https://localhost:44376/api/FoodItem/update-item-code/${item.item_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            item_id: item.item_id,
            item_code: item.item_code,
          }),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        Swal.fire("Error", err, "error");
        return;
      }

      Swal.fire("Success", "Item updated!", "success");
      setEditingId(null);
      fetchData();

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Update failed", "error");
    }
  };

  return (
    <div>
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Item Code</h1>

        {/* KEEP YOUR OLD SAVE IF NEEDED */}
        {/* <button className={styles.saveBtn}>SAVE ALL</button> */}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Item Code</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item: any) => (
              <tr key={item.item_id}>
                <td>{item.item_name}</td>

                <td>
                  <input
                    type="text"
                    value={item.item_code}
                    disabled={editingId !== item.item_id}
                    onChange={(e) =>
                      handleChange(item.item_id, e.target.value)
                    }
                    className={styles.input}
                  />
                </td>

                <td>
                  {editingId === item.item_id ? (
                    <button
                      className={styles.saveBtn}
                      onClick={() => handleRowSave(item)}
                    >
                      SAVE
                    </button>
                  ) : (
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEdit(item.item_id)}
                    >
                      ✏️ 
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>


    
<div className={styles.pagination}>
  <button 
    className={styles.previous}
    onClick={() => router.push("/Items")}
  >
    PREVIOUS
  </button>

  <button 
    className={styles.next}
    onClick={() => router.push("/tax")}
  >
    NEXT
  </button>
</div>
    </div>
  );
}