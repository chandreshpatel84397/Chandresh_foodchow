"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./applytax.css";

export default function Page() {
  const router = useRouter();

  const [taxes, setTaxes] = useState<any[]>([]);

  async function fetchTaxes() {
    const res = await fetch(
      "https://localhost:44376/api/FoodShopTax/getall"
    );
    const data = await res.json();

    const list = data.data || data;
    setTaxes(Array.isArray(list) ? list : []);
  }

  useEffect(() => {
    fetchTaxes();
  }, []);

  return (
    <div className="pageWrapper">
      <div className="card">

        {/* HEADER */}
        <div className="headerRow">
          <h2>Apply Tax</h2>
          <button className="helpBtn">HELP</button>
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
            {taxes.map((t, i) => {
              const isInclude = t.tax_type == 1;

              return (
                <tr key={t.food_shop_tax_id}>
                  <td>{i + 1}</td>

                  <td>{t.tax_name}</td>

                  <td>{t.tax_percentage}</td>

                  <td>
                    {isInclude ? "INCLUDE TAX" : "EXCLUDE TAX"}
                  </td>

                  <td>
                    <button
                      className={`applyBtn ${!isInclude ? "disabledBtn" : ""}`}
                      disabled={!isInclude}
                      onClick={() => {
                        if (isInclude) {
                          router.push(
                            `/apply-tax/items/${t.food_shop_tax_id}`
                          );
                        }
                      }}
                    >
                      APPLY TAX
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* FOOTER BUTTONS */}
        <div className="footerRow">
          <button
            className="navBtn"
            onClick={() => router.push("/tax")}
          >
            PREVIOUS
          </button>

          <button
            className="navBtn"
            onClick={() => router.push("/item_deals/Deals/display")}
          >
            NEXT
          </button>
          
        </div>

      </div>
    </div>
  );
}