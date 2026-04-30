"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "./taxadd.css";

export default function Page() {
  const router = useRouter();

  const [form, setForm] = useState({
    tax_name: "",
    tax_percentage: "",
    tax_type: "exclude",
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        tax_name:           form.tax_name.trim(),
        tax_percentage:     Number(form.tax_percentage),
        tax_type:           form.tax_type === "include" ? "1" : "0",
        shop_id:            1,
        is_active:          true,
        food_country_tax_id: null,
      };

      console.log("SENDING PAYLOAD:", JSON.stringify(payload));

      const res = await fetch("https://localhost:44376/api/FoodShopTax/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("API RESPONSE:", data);

      if (res.ok) {
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Tax Added Successfully",
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
        <h2>ADD NEW TAX</h2>

        <form onSubmit={handleSubmit}>
          <div className="formGrid">
            <div>
              <label>Type of Tax *</label>
              <input
                type="text"
                value={form.tax_name}
                onChange={(e) => setForm({ ...form, tax_name: e.target.value })}
                required
              />
            </div>

            <div>
              <label>Tax Rate (%) *</label>
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

          <div className="statusOptions">
            <label>
              <input
                type="radio"
                name="tax_type"
                checked={form.tax_type === "include"}
                onChange={() => setForm({ ...form, tax_type: "include" })}
              />
              Include This Tax On Item Prices
            </label>

            <label>
              <input
                type="radio"
                name="tax_type"
                checked={form.tax_type === "exclude"}
                onChange={() => setForm({ ...form, tax_type: "exclude" })}
              />
              Exclude This Tax On Item Prices
            </label>
          </div>

          <div className="buttonRow">
            <button type="submit" className="addBtn" disabled={loading}>
              {loading ? "ADDING..." : "ADD"}
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