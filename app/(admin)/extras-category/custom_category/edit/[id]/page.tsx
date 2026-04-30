"use client";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditCategoryPage() {
  const router = useRouter();     
  const params = useParams();
  const categoryId = params.id; // dynamic id from URL

  const [name, setName] = useState("");
  const [status, setStatus] = useState<number>(1);

  // FETCH OLD DATA BY ID
  useEffect(() => {
    async function fetchCategory() {
      const response = await fetch(
        `https://localhost:44376/api/FoodItemCustomCategory/getbyid/${categoryId}`
      );

      if (!response.ok) {
        alert("Failed to fetch category");
        return;
      }

      const data = await response.json();

      // set old values in form
      setName(data.custom_cat_name);
      setStatus(data.status);
    }

    fetchCategory();
  }, [categoryId]);

  // UPDATE API CALL
  async function handleUpdate(e: any) {
    e.preventDefault();
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to undo this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0aa89e",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Update it!"
  });
    const response = await fetch(
      `https://localhost:44376/api/FoodItemCustomCategory/update?category_id=${categoryId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          custom_cat_name: name,
          status: status,
        }),
      }
    );

    if (!response.ok) {
    Swal.fire("Error!", "Update failed.", "error");
      return;
    }

   
    router.push("/extras-category/custom_category/show_category"); // go back to list
    Swal.fire(
        "Updated!",
        "Category has been updated.",
        "success"
      );
}

  return (
    <div className="card">
      <h2>Edit Extra Category</h2>

      <form onSubmit={handleUpdate}>
        <label className="label">
          Category Name <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label className="label">Status</label>
        <div className="status-group">
          <label>
            <input
              type="radio"
              checked={status === 1}
              onChange={() => setStatus(1)}
            />
            Active
          </label>
          <label>
            <input
              type="radio"
              checked={status === 0}
              onChange={() => setStatus(0)}
            />
            Deactive
          </label>
        </div>
        <div className="btn-group">
          <button type="submit" className="btn-add">
            UPDATE
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => router.back()}>CANCEL
          </button>
        </div>
    </form>
</div>
  );
}
