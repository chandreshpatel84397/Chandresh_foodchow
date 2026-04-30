"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./category.css";
import Swal from "sweetalert2";

export default function Page() {
  const router = useRouter();

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    cate_name: "",
    status: 1,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      Swal.fire("Error", "Image must be less than 5MB", "error");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("cate_name", form.cate_name);
    formData.append("status", form.status.toString());

    if (file) formData.append("image", file);

    const res = await fetch(
      "https://localhost:44376/api/FoodCategory/add",
      {
        method: "POST",
        body: formData,
      }
    );

    if (res.ok) {
      await Swal.fire("Success", "Category Added!", "success");
      router.push("/inside_folder/category");
    } else {
      const err = await res.text(); // 👈 DEBUG
      console.log(err);
      Swal.fire("Error", err || "Failed to add", "error");
    }
  }

  return (
    <div className="pageWrapper">
      <div className="card">
        <h2>Add New Category</h2>

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
              ADD
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