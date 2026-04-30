"use client";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  // State to store categories from API
  const [categories, setCategories] = useState<any[]>([]);

  // FETCH DATA ON PAGE LOAD
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://localhost:44376/api/FoodItemCustomCategory/getall/1"
      );

      if (!response.ok) {
        alert("Failed to fetch data");
        return;
      }

      const data = await response.json();
      setCategories(data);
    }

    fetchData();
  }, []);

  //  NEW: TOGGLE STATUS FUNCTION
  // This updates database + UI
  
  async function toggleStatus(item: any) {      
    // Calculate new status (1 -> 0 or 0 -> 1)
    const newStatus = item.status === 1 ? 0 : 1;

    // Call UPDATE API
    const response = await fetch(
      `https://localhost:44376/api/FoodItemCustomCategory/update?category_id=${item.custom_cat_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          custom_cat_name: item.custom_cat_name, // required for update
          status: newStatus,                     // updated status
        }),
      }
    );

    if (!response.ok) {
      alert("Failed to update status");
      return;
    }

    // Update UI after successful DB update
    setCategories((prev) =>
      prev.map((cat) =>
        cat.custom_cat_id === item.custom_cat_id
          ? { ...cat, status: newStatus }
          : cat
      )
    );

    // Show message
    // alert(
    //   newStatus === 1
    //     ? "Category is now Active"
    //     : "Category is now Not Active"
    // );
  }

  // DELETE CATEGORY
async function deleteCategory(id: number) {

  
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to undo this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0aa89e",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  });

  if (!result.isConfirmed) return;

  //  Call DELETE API
  const response = await fetch(
    `https://localhost:44376/api/FoodItemCustomCategory/delete/${id}`,
    { method: "DELETE" }
  );

  if (!response.ok) {
    Swal.fire("Error!", "Delete failed.", "error");
    return;
  }

  //  Update UI
  setCategories((prev) =>
    prev.filter((item) => item.custom_cat_id !== id)
  );

  //  Success popup
  Swal.fire(
    "Deleted!",
    "Category has been deleted.",
    "success"
  );
}

  return (
    <div>
    <div className="container">
      {/* HEADER SECTION */}
      <div className="header">
        <h2>
          Extras Category <br />
          <small>(Toppings, Extras etc.)</small>
        </h2>

        <button
          className="btn-add"
          onClick={() => router.push("/extras-category/custom_category/add_category")}
        >
          + ADD NEW EXTRAS CATEGORY
        </button>
      </div>

      {/* CATEGORY LIST */}
      <div className="list">
        {categories.map((item) => (
          <div className="row" key={item.custom_cat_id}>
            <div>{item.custom_cat_name}</div>

            <div className="actions">
              {/* EDIT BUTTON */}
              <button
                className="icon-btn edit"
                onClick={() =>
                  router.push(`/extras-category/custom_category/edit/${item.custom_cat_id}`)
                }
              >
                ✏️
              </button>

              {/* DELETE BUTTON */}
              <button
                className="icon-btn delete"
                onClick={() => deleteCategory(item.custom_cat_id)}
              >
                🗑
              </button>

              {/*  UPDATED: WORKING TOGGLE */}
              <label className="switch">
                <input
                  type="checkbox"
                  checked={item.status === 1}
                  onChange={() => toggleStatus(item)} //  CHANGED: removed readOnly and added function
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
    
<div className="pagination">
  <button 
    className="previous"
    onClick={() => router.push("/insert")}
  >
    PREVIOUS
  </button>

  <button 
    className="next"
    onClick={() => router.push("/extras")}
  >
    NEXT
  </button>
</div>
    
    </div>
  );
}