"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./category.css";
import Swal from "sweetalert2";

interface Category {
  categoryId: number;
  categoryName: string;
  categoryImage: string | null;
  categoryStatus: boolean;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch(
        "https://localhost:44376/api/FoodCategory/getall",
        { cache: "no-store" }
      );

      const data = await res.json();
      setCategories(data);
    } catch {
      Swal.fire("Error", "Failed to load categories", "error");
    }
  }

  async function deleteCategory(id: number) {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    const res = await fetch(
      `https://localhost:44376/api/FoodCategory/delete/${id}`,
      { method: "DELETE" }
    );

    if (res.ok) {
      fetchCategories();
      Swal.fire("Deleted!", "", "success");
    }
  }

async function toggleStatus(id: number) {
  const result = await Swal.fire({
    title: "Change Status?",
    text: "Do you want to update this category status?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#aaa",
    confirmButtonText: "Yes, update",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  const res = await fetch(
    `https://localhost:44376/api/FoodCategory/toggle/${id}`,
    { method: "PATCH" }
  );

  if (res.ok) {
    setCategories((prev) =>
      prev.map((c) =>
        c.categoryId === id
          ? { ...c, categoryStatus: !c.categoryStatus }
          : c
      )
    );

    Swal.fire({
      icon: "success",
      title: "Status Updated",
      text: "Category status changed successfully",
      timer: 1500,
      showConfirmButton: false,
    });
  } else {
    Swal.fire("Error", "Status update failed", "error");
  }
}

  return (
     <div>
    <div className="card">
      <div className="cardHeader">
        <div>
          <h2>Category</h2>
          <p>(e.g Italian, Mexican, Thai)</p>
        </div>

        <button
          className="addBtn"
          onClick={() => router.push("/inside_folder/add")}
        >
          + ADD NEW CATEGORY
        </button>
      </div>

      <div className="tableWrapper">
        <table>
          <thead>
            <tr>
              
              <th>Image</th>
              <th>Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat.categoryId}>
               

                <td>
                  <div className="imageCircle">
                    {cat.categoryImage && (
                      <img
                        src={`https://localhost:44376${cat.categoryImage}`}
                        alt="category"
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                </td>

                <td>{cat.categoryName}</td>

                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={cat.categoryStatus}
                      onChange={() =>
                        toggleStatus(cat.categoryId)
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </td>

                <td>
                  <div className="actionGroup">
                    <button
                      className="editBtn"
                      onClick={() =>
                        router.push(
                          `/inside_folder/category/edit/${cat.categoryId}`
                        )
                      }
                    >
                      ✏
                    </button>

                    <button
                      className="deleteBtn"
                      onClick={() =>
                        deleteCategory(cat.categoryId)
                      }
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>


<div className="pagination">
  <button 
    className="previous"
    onClick={() => router.push("")}
  >
    PREVIOUS
  </button>

  <button 
    className="next"
    onClick={() => router.push("/variants")}
  >
    NEXT
  </button>
</div>
    </div>
  );
}