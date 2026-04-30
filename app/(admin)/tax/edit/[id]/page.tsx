"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import "./taxedit.css";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [form, setForm] = useState({
    tax_name: "",
    tax_percentage: "",
  });

  const [loading, setLoading] = useState(false);

  async function fetchTax() {
    const res = await fetch("https://localhost:44376/api/FoodShopTax/getall");
    const data = await res.json();

    const tax = data.find((x: any) => x.food_shop_tax_id == id);

    setForm({
      tax_name: tax.tax_name,
      tax_percentage: tax.tax_percentage,
    });
  }

  useEffect(() => {
    fetchTax();
  }, []);

  async function handleUpdate(e: any) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `https://localhost:44376/api/FoodShopTax/update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tax_name: form.tax_name.trim(),
            tax_percentage: Number(form.tax_percentage),
          }),
        }
      );

      const data = await res.json();
      console.log("API RESPONSE:", data);

      if (res.ok) {
        await Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Tax Updated Successfully",
        });
        router.push("/tax");

      } else if (res.status === 409) {
        // Duplicate tax name
        await Swal.fire({
          icon: "warning",
          title: "Duplicate Tax",
          text: data.message, // e.g. "Tax with name 'GST' already exists."
        });

      } else {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message ?? JSON.stringify(data),
        });
      }

    } catch (err: any) {
      console.error(err);
      await Swal.fire({
        icon: "error",
        title: "Network Error",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pageWrapper">
      <div className="card">
        <h2>Edit Tax</h2>

        <form onSubmit={handleUpdate}>
          <div className="formGrid">
            <div>
              <label>Type of Tax *</label>
              <input
                type="text"
                value={form.tax_name}
                onChange={(e) =>
                  setForm({ ...form, tax_name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label>Amount (%) *</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.tax_percentage}
                onChange={(e) =>
                  setForm({ ...form, tax_percentage: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="buttonRow">
            <button type="submit" className="addBtn" disabled={loading}>
              {loading ? "UPDATING..." : "UPDATE"}
            </button>

            <button
              type="button"
              className="cancelBtn"
              onClick={() => router.push("/tax")}
              disabled={loading}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}