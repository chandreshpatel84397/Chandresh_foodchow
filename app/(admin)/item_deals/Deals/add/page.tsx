"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./dealtype.css";

interface DealType {
  dealTypeId: number;
  dealTypeName: string;
}

export default function SelectDealTypePage() {
  const router = useRouter();
  const [dealTypes, setDealTypes] = useState<DealType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDealTypes();
  }, []);

  async function fetchDealTypes() {
    try {
      const res = await fetch(
        "https://localhost:44376/api/FoodDealType/get-all"
      );

      if (!res.ok) {
        alert("Failed to fetch deal types");
        return;
      }

      const data = await res.json();
      setDealTypes(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  }

const handleChoose = (type: any) => {
  router.push(
  `/item_deals/Deals/add/insertDeals?type=${type.dealTypeId}`
);
};

 return (
  <div className="deal-container">
    <div className="deal-wrapper">
      <h2 className="page-title">ADD NEW DEAL</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="deal-type-grid">
          {dealTypes.map((type) => (
            <div className="deal-card" key={type.dealTypeId}>
              <h3>{type.dealTypeName}</h3>

              <button
                className="choose-btn"
                onClick={() => handleChoose(type)}
              >
                Choose
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}