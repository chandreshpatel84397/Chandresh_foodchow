"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./tax.css";
import Swal from "sweetalert2";

export default function TaxPage() {
  const router = useRouter();
  const [taxes, setTaxes] = useState<any[]>([]);

  async function fetchTaxes() {
    try {
      const res = await fetch("https://localhost:44376/api/FoodShopTax/getall");
      const data = await res.json();

      const list = data.data || data;
      setTaxes(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch taxes", "error");
    }
  }

  useEffect(() => {
    fetchTaxes();
  }, []);

  async function deleteTax(id: number) {
    const confirm = await Swal.fire({
      title: "Delete Tax?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1abc9c",
    });

    if (confirm.isConfirmed) {
      await fetch(`https://localhost:44376/api/FoodShopTax/delete/${id}`, {
        method: "DELETE",
      });

      fetchTaxes();
    }
  }

  return (
    <div className="pageWrapper">
      <div className="card">

        {/* HEADER */}
        <div className="headerRow">
          <h2>Taxes</h2>

          <div className="headerActions">
            <button
              className="addBtn"
              onClick={() => router.push("/tax/add")}
            >
              + ADD NEW TAX
            </button>

            <button className="helpBtn">HELP</button>
          </div>
        </div>

        {/* TABLE */}
        <table>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Name Of The Tax</th>
              <th>Tax (%)</th>
              <th>Tax Type</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {taxes.map((tax, index) => (
              <tr key={tax.food_shop_tax_id}>
                <td>{index + 1}</td>

                <td>{tax.tax_name}</td>

                <td>{tax.tax_percentage}</td>

                <td>
                  {Number(tax.tax_type) === 1
                    ? "INCLUDE TAX"
                    : "EXCLUDE TAX"}
                </td>

                <td className="actionCell">
                  <button
                    className="editBtn"
                    onClick={() =>
                      router.push(`/tax/edit/${tax.food_shop_tax_id}`)
                    }
                  >
                    ✏
                  </button>

                  <button
                    className="deleteBtn"
                    onClick={() =>
                      deleteTax(tax.food_shop_tax_id)
                    }
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* FOOTER */}
        <div className="footerRow">
          <button
            className="navBtn"
            onClick={() =>
              router.push("/Item_Code")
            }
          >
            PREVIOUS
          </button>

          <button
            className="navBtn"
            onClick={() => router.push("/apply-tax")}
          >
            NEXT
          </button>
        </div>

      </div>
    </div>
  );
}