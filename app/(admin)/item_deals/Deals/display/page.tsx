"use client";

import "./display.css";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

type Deal = {
  dealId: number;
  dealName: string;
  dealTypeId: number;
  shopId: number;
  dealImage: string | null;
  dealDesc: string;
  dealPrice: number;
totalDealPrice: number;
  dealMRP: number;
  status: number;
  percentDiscountOnCart: number;
  validOrderMethod: string;
  validPaymentMethod: string;
  applyDiscount: number;
  minOrder: number;
};

export default function DealsPage() {
  const router = useRouter();

  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const fetchDeals = async () => {
    try {
      setLoading(true);

      const response = await fetch("https://localhost:44376/api/FoodDeal/getall", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch deals");
      }

      const data = await response.json();
      setDeals(data || []);
    } catch (error) {
      console.error("Error fetching deals:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load deals data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleDelete = async (dealId: number) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "This deal will be deleted.",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e60000",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(
        `https://localhost:44376/api/FoodDeal/delete/${dealId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Deal deleted successfully",
      });

      fetchDeals();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to delete deal",
      });
    }
  };

  const handleToggleStatus = async (deal: Deal) => {
    const newStatus = deal.status === 1 ? 0 : 1;

    try {
      const response = await fetch(
        `https://localhost:44376/api/FoodDeal/update-status/${deal.dealId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      setDeals((prev) =>
        prev.map((item) =>
          item.dealId === deal.dealId ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to update status",
      });
    }
  };

  const handleAddImageClick = (dealId: number) => {
    fileInputRefs.current[dealId]?.click();
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

const handleImageChange = async (
  e: React.ChangeEvent<HTMLInputElement>,
  dealId: number
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const base64Image = await convertFileToBase64(file);

    const pureBase64 = base64Image.split(",")[1];

    const response = await fetch(
      `https://localhost:44376/api/FoodDeal/update-image/${dealId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dealImage: pureBase64,
        }),
      }
    );

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(responseText || "Image update failed");
    }

    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Image updated successfully",
    });

    fetchDeals();
  } catch (error: any) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message || "Unable to upload image",
    });
  }
};
  const getImageSrc = (image: string | null) => {
  if (!image) return "/no-image.png";

  if (
    image.startsWith("data:image/") ||
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  return `data:image/png;base64,${image}`;
};

  return (
    <div>
    <div className="deals-page-wrapper">
      <div className="deals-main-card">
        <div className="deals-header">
          <h2>Deals</h2>

          <div className="deals-top-buttons">
            <button
              className="add-new-btn"
              onClick={() => router.push("/item_deals/Deals/add")}
            >
              + ADD NEW DEAL
            </button>

            <button className="help-btn">HELP</button>
          </div>
        </div>

        <div className="deals-table-wrapper">
          <table className="deals-table">
            <thead>
              <tr>
                <th>Deals Name</th>
                <th>Photo</th>
                <th>Total Price</th>
                <th>Edit</th>
                <th>Delete</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="table-message">
                    Loading deals...
                  </td>
                </tr>
              ) : deals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-message">
                    No deals found
                  </td>
                </tr>
              ) : (
                deals.map((item) => (
                  <tr key={item.dealId}>
                    <td className="deal-name-cell">{item.dealName}</td>

                    <td className="photo-cell">
                      <div className="photo-box">
                        <div className="photo-image-wrap">
                          {item.dealImage ? (
  <img
    src={getImageSrc(item.dealImage)}
    alt={item.dealName}
    className="deal-photo"
  />
) : (
  <img
    src="/no-image.png"
    alt="No image"
    className="deal-photo"
  />
)}
                        </div>

                        <button
                          className="photo-add-btn"
                          onClick={() => handleAddImageClick(item.dealId)}
                        >
                          + ADD
                        </button>

                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          ref={(el) => {
                            fileInputRefs.current[item.dealId] = el;
                          }}
                          onChange={(e) => handleImageChange(e, item.dealId)}
                        />
                      </div>
                    </td>

                    <td className="price-cell">Rs.{item.totalDealPrice}</td>

                    <td>
                      <button
                        className="icon-round-btn edit-btn"
                        onClick={() =>

                          router.push(`/item_deals/Deals/edit/${item.dealId}`)                        }
                      >
                        ✏️
                      </button>
                    </td>

                    <td>
                      <button
                        className="icon-round-btn delete-btn"
                        onClick={() => handleDelete(item.dealId)}
                      >
                        🗑
                      </button>
                    </td>

                    <td>
                      <button
                        className={`toggle-switch ${
                          item.status === 1 ? "active" : ""
                        }`}
                        onClick={() => handleToggleStatus(item)}
                      >
                        <span className="toggle-circle"></span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>


<div className="pagination">
  <button 
    className="previous"
    onClick={() => router.push("/apply-tax")}
  >
    PREVIOUS
  </button>

  <button 
    className="next"
    onClick={() => router.push("/additional_menu/display")}
  >
    NEXT
  </button>
</div>

    </div>
  );
}