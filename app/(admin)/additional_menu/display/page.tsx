"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./style.css";
import Swal from "sweetalert2";
import QRCode from "qrcode";

export default function Page() {
  const [menus, setMenus] = useState<any[]>([]);
  const router = useRouter();

  const fetchMenus = async () => {
    const res = await fetch(
      "https://localhost:44376/api/FoodMenu/get-all"
    );
    const data = await res.json();

    console.log("API DATA:", data); //   VERY IMPORTANT

    setMenus(data);
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // QR
  // Download menu details as text file
const downloadQR = async (menu: any) => {
  const id = menu.menuId || menu.id;

  try {
    // STEP 1: Get all categories (for names)
    const catRes = await fetch(`https://localhost:44376/api/FoodCategory/getall`);
    const allCategories: any[] = await catRes.json();

    // STEP 2: Get selected items for this menu (itemId + categoryId)
    const itemsRes = await fetch(`https://localhost:44376/api/FoodMenu/get-items/${id}`);
    const selectedItems: any[] = await itemsRes.json();

    // STEP 3: Get unique categoryIds from selected items
    const uniqueCategoryIds = [...new Set(selectedItems.map((i: any) => i.categoryId))];

    // STEP 4: For each category, fetch item names
    const categoryItemMap: any = {};
    for (const categoryId of uniqueCategoryIds) {
      const res = await fetch(
        `https://localhost:44376/api/FoodItem/get-item-names?categoryId=${categoryId}`
      );
      const data = await res.json();
      categoryItemMap[categoryId] = data; // array of { item_id, item_name }
    }

    // STEP 5: Build text content
    let content = "";
    content += `================================================\n`;
    content += `  MENU DETAILS\n`;
    content += `================================================\n`;
    content += `Menu Name : ${menu.menuName}\n`;
    content += `For Online: ${menu.forOnline === 1 ? "Yes" : "No"}\n`;
    content += `For POS   : ${menu.forPos === 1 ? "Yes" : "No"}\n`;
    content += `------------------------------------------------\n\n`;

    if (uniqueCategoryIds.length === 0) {
      content += `(No categories or items assigned to this menu)\n`;
    } else {
      uniqueCategoryIds.forEach((categoryId, index) => {
        // Find category name
        const cat = allCategories.find((c: any) => c.categoryId === categoryId);
        const catName = cat ? cat.categoryName : `Category ${categoryId}`;

        content += `CATEGORY ${index + 1}: ${catName}\n`;
        content += `  Items:\n`;

        // Find only selected itemIds for this category
        const selectedItemIds = selectedItems
          .filter((i: any) => i.categoryId === categoryId)
          .map((i: any) => i.itemId);

        const allItemsInCat = categoryItemMap[categoryId] || [];

        // Filter to only selected items
        const filteredItems = allItemsInCat.filter((item: any) =>
          selectedItemIds.includes(item.item_id)
        );

        if (filteredItems.length > 0) {
          filteredItems.forEach((item: any, i: number) => {
            content += `    ${i + 1}. ${item.item_name}\n`;
          });
        } else {
          content += `    (No items)\n`;
        }

        content += `\n`;
      });
    }

    content += `================================================\n`;
    content += `Generated on: ${new Date().toLocaleString()}\n`;
    content += `================================================\n`;

    // STEP 6: Download as .txt
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${menu.menuName}_details.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Error generating menu file:", error);
    Swal.fire("Error", "Could not generate menu details file!", "error");
  }
};

  const deleteMenu = async (menu: any) => {
    // 👇 FIX: detect correct ID dynamically
    const id = menu.menuId || menu.id;

    console.log("Deleting ID:", id);

    if (!id) {
      Swal.fire("Error", "ID not found!", "error");
      return;
    }

    const confirm = await Swal.fire({
      title: "Delete Menu?",
      text: "Are you sure?",
      showCancelButton: true,
      confirmButtonColor: "#00a99d",
    });

    if (confirm.isConfirmed) {
      const res = await fetch(
        `https://localhost:44376/api/FoodMenu/delete/${id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        Swal.fire("Deleted!", "", "success");
        fetchMenus();
      } else {
        Swal.fire("Error deleting!", "", "error");
      }
    }
  };

  // Toggle
  const updateAvailability = async (menu: any, field: string, value: number) => {
    const id = menu.menuId || menu.id;

    await fetch(
      `https://localhost:44376/api/FoodMenu/update-menu/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...menu,
          [field]: value,
        }),
      }
    );

    fetchMenus();
  };

  return (
    <div>
    <div className="container">
      <div className="top-bar">
        <h2>Shop Menu</h2>

        <div>
          <button
            className="add-btn"
            onClick={() => router.push("/additional_menu/add")}
          >
            + ADD NEW MENU
          </button>
          <button className="help-btn">HELP</button>
        </div>
      </div>

      <div className="menu-table">
        <div className="header-row">
          <div>Menu Name</div>
          <div>Edit Menu</div>
          <div>View Menu</div>
          <div>Download QR Code</div>
          <div>MENU AVAILABLE FOR</div>
          <div>Delete Menu</div>
        </div>

        {menus.map((menu, index) => (
          <div
            className="menu-row"
            key={`${menu.menuId || menu.id}-${index}`} //   FIX
          >
            <div className="menu-name">{menu.menuName}</div>

            {/* EDIT */}
            <div>
              <button className="circle-btn"
              onClick={() => router.push(`/additional_menu/edit/${menu.id}`)}>✏️</button>
            </div>

            {/* VIEW */}
            <div>
              <button className="rect-btn">👁</button>
            </div>

            {/* QR */}
  <div className="cell-center">

            <div className="qr-icon"
               onClick={() => downloadQR(menu)}
            >
  <img src="/dinner-qr-code (1).jpg" alt="QR" />
</div>
           </div>
  <div className="cell-center">

            {/* CHECKBOX */}
            <div className="check-group">
              <label className="custom-check">
                <input
                  type="checkbox"
                  checked={menu.forOnline === 1}
                  onChange={(e) =>
                    updateAvailability(
                      menu,
                      "forOnline",
                      e.target.checked ? 1 : 0
                    )
                  }
                />
                <span></span>
                Online Order
              </label>

              <label className="custom-check">
                <input
                  type="checkbox"
                  checked={menu.forPos === 1}
                  onChange={(e) =>
                    updateAvailability(
                      menu,
                      "forPos",
                      e.target.checked ? 1 : 0
                    )
                  }
                />
                <span></span>
                POS
              </label>
            </div>
</div>
            {/* DELETE */}
            <div>
              <button
                className="delete-btn"
                onClick={() => deleteMenu(menu)} //   FIX
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>





    
<div className="pagination">
  <button 
    className="previous"
    onClick={() => router.push("/item_deals/Deals/display")}
  >
    PREVIOUS
  </button>

  <button 
    className="next"
    onClick={() => router.push("/category-mapper")}
  >
    NEXT
  </button>
</div>
    </div>
  );
}