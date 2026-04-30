"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "animate.css"; // ✅ IMPORTANT for animation
import "./applyitems.css";

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const tax_id = Number(params.tax_id);

  const [items, setItems] = useState<any[]>([]);
  const [checked, setChecked] = useState<any>({});
  const [taxPercent, setTaxPercent] = useState(0);
  const [loading, setLoading] = useState(false);

  const getKey = (item: any) => String(item.item_id);

  async function fetchTax() {
    const res = await fetch("https://localhost:44376/api/FoodShopTax/getall");
    const data = await res.json();

    const tax = data.find((t: any) => t.food_shop_tax_id === tax_id);

    if (tax) setTaxPercent(Number(tax.tax_percentage));
  }

  async function fetchItems() {
    const res = await fetch("https://localhost:44376/api/FoodItem/get");
    const data = await res.json();

    setItems(data);
    return data;
  }

  async function fetchApplied(itemsList: any[]) {
    const res = await fetch(
      `https://localhost:44376/api/FoodApplyTax/applied/${tax_id}`
    );

    const data = await res.json();

    const map: any = {};

    itemsList.forEach((item: any) => {
      const key = getKey(item);

      const found = data.find(
        (x: any) =>
          x.item_id == item.item_id &&
          x.item_size_id == item.item_id
      );

      if (found) map[key] = true;
    });

    setChecked(map);
  }

  useEffect(() => {
    async function init() {
      await fetchTax();
      const list = await fetchItems();
      await fetchApplied(list);
    }

    init();
  }, []);

  // ✅ CHECKBOX WITH CENTER SWAL
  async function handleCheckbox(item: any, isChecked: boolean) {
    const key = getKey(item);

    setChecked((prev: any) => ({
      ...prev,
      [key]: isChecked,
    }));

    const url = isChecked ? "apply" : "remove";

    try {
      await fetch(`https://localhost:44376/api/FoodApplyTax/${url}`, {
        method: isChecked ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_id: item.item_id,
          size_id: item.item_id,
          tax_id,
          shop_id: 1,
        }),
      });

      // ✅ CENTER POPUP
      Swal.fire({
        icon: isChecked ? "success" : "info",
        title: isChecked
          ? "Tax Applied Successfully"
          : "Tax Removed",
        text: item.item_name,
        confirmButtonColor: "#1abc9c",
        confirmButtonText: "OK",
        backdrop: true,
        allowOutsideClick: false,
        showClass: {
          popup: "animate__animated animate__zoomIn"
        },
        hideClass: {
          popup: "animate__animated animate__zoomOut"
        }
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        confirmButtonColor: "#e74c3c",
      });
    }
  }

  // ✅ APPLY ALL
  async function applyAll() {
    setLoading(true);

    for (const item of items) {
      await handleCheckbox(item, true);
    }

    setLoading(false);

    Swal.fire({
      icon: "success",
      title: "All Taxes Applied",
      text: "Applied to all items successfully",
      confirmButtonColor: "#1abc9c",
      showClass: {
        popup: "animate__animated animate__fadeInDown"
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp"
      }
    });
  }

  // ✅ REMOVE ALL
  async function removeAll() {
    setLoading(true);

    for (const item of items) {
      await handleCheckbox(item, false);
    }

    setLoading(false);

    Swal.fire({
      icon: "success",
      title: "All Taxes Removed",
      text: "Removed from all items",
      confirmButtonColor: "#1abc9c",
      showClass: {
        popup: "animate__animated animate__fadeInDown"
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp"
      }
    });
  }

  return (
    <div className="pageWrapper">
      <div className="card">

        <button className="backBtn" onClick={() => router.push("/apply-tax")}>
          ← BACK
        </button>

        <div className="topRow">
          <h2>Apply Tax</h2>

          <div>
            <button onClick={applyAll} className="actionBtn">
              APPLY ALL
            </button>

            <button onClick={removeAll} className="actionBtn">
              REMOVE ALL
            </button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th></th>
              <th>Item Name</th>
              <th>Price</th>
              <th>Tax</th>
              <th>Price (Without Tax)</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const key = getKey(item);
              const isChecked = checked[key];

              const price = Number(item.open_price || 0);

              const tax = isChecked
                ? (price * taxPercent) / 100
                : 0;

              const without = isChecked ? price - tax : price;

              return (
                <tr key={key}>
                  <td>
                    <input
                      type="checkbox"
                      checked={isChecked || false}
                      onChange={(e) =>
                        handleCheckbox(item, e.target.checked)
                      }
                    />
                  </td>

                  <td>{item.item_name}</td>
                  <td>{price}</td>

                  <td>
                    {isChecked
                      ? `${taxPercent}% Rs ${tax.toFixed(2)}`
                      : "-"}
                  </td>

                  <td>{without.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

      </div>
    </div>
  );
}