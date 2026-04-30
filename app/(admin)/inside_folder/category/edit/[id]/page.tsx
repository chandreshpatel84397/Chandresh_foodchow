"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import "./pagecategory.css";
import Swal from "sweetalert2";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    cate_name: "",
    cate_image: "",
    status: 1,
  });

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `https://localhost:44376/api/FoodCategory/${id}`
      );

      const data = await res.json();

      setForm({
        cate_name: data.cate_name || "",
        cate_image: data.cate_image || "",
        status: data.status ?? 1,
      });

      if (data.cate_image) {
        setPreview(`https://localhost:44376${data.cate_image}`);
      }
    }

    if (id) fetchData();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      Swal.fire("Error", "Image must be less than 5MB", "error");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("cate_name", form.cate_name);
    formData.append("status", form.status.toString());
    formData.append("cate_image", form.cate_image);

    if (file) {
      formData.append("image", file);
    }

    const res = await fetch(
      `https://localhost:44376/api/FoodCategory/update/${id}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (res.ok) {
      await Swal.fire("Success", "Updated!", "success");
      router.push("/inside_folder/category");
    } else {
      Swal.fire("Error", "Update failed", "error");
    }
  }

  return (
    <div className="pageWrapper">
      <div className="card">
        <h2>Update Category</h2>

        <form onSubmit={handleSubmit}>
          <label>Category Name *</label>
          <input
            type="text"
            value={form.cate_name}
            onChange={(e) =>
              setForm({ ...form, cate_name: e.target.value })
            }
          />

          <div className="statusRow">
            <label>Status</label>
            <div className="statusOptions">
              <label>
                <input
                  type="radio"
                  checked={form.status === 1}
                  onChange={() =>
                    setForm({ ...form, status: 1 })
                  }
                />
                Active
              </label>

              <label>
                <input
                  type="radio"
                  checked={form.status === 0}
                  onChange={() =>
                    setForm({ ...form, status: 0 })
                  }
                />
                De-Active
              </label>
            </div>
          </div>

          <label style={{ marginTop: "25px" }}>Choose Image</label>

          <div className="imageSection">
            <div className="uploadBox">
              {preview && (
                <img
                  src={preview}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "14px",
                  }}
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className="uploadRight">
              <button
                type="button"
                className="uploadBtn"
                onClick={() =>
                  document
                    .querySelector<HTMLInputElement>(".uploadBox input")
                    ?.click()
                }
              >
                UPLOAD IMAGE
              </button>

              <p className="helperText">
                Images should be 600x400 for best view.
              </p>
            </div>
          </div>

          <div className="buttonRow">
            <button type="submit" className="addBtn">
              UPDATE
            </button>

            <button
              type="button"
              className="cancelBtn"
              onClick={() => router.push("/inside_folder/category")}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}