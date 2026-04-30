"use client";

import React, { useEffect, useState } from "react";
import "./style.css";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Page() {
  const [step, setStep] = useState(1);
  const [menuName, setMenuName] = useState("");
  const [menuId, setMenuId] = useState<number>(0);
const router = useRouter();
  const [timings, setTimings] = useState(
    daysList.map((day) => ({
      day,
      checked: false,
      type: "close",
      start: "",
      end: "",
    }))
  );

  const [categories, setCategories] = useState<any[]>([]);
  const [categoryItems, setCategoryItems] = useState<{ [key: number]: any[] }>({});
  const [openCategories, setOpenCategories] = useState<number[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  // 🔹 FETCH CATEGORY
  useEffect(() => {
    fetch("https://localhost:44376/api/FoodCategory/getall")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  // 🔹 NEXT BUTTON
  const handleNext = async () => {
    if (!menuName) {
      Swal.fire("Error", "Please enter menu name first", "error");
      return;
    }

    const res = await fetch(
      "https://localhost:44376/api/FoodMenu/create-menu",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId: 1,
          menuName,
          description: "",
          startTime: "",
          endTime: "",
          status: 1,
          forOnline: 1,
          forPos: 1,
        }),
      }
    );

    //const text = await res.text();

    const data = await res.json();

console.log("MENU ID:", data); // debug

setMenuId(data);// replace later
    setStep(2);
  };

  // 🔹 TOGGLE CATEGORY (MULTIPLE OPEN)
  const toggleCategory = async (categoryId: number) => {
    if (openCategories.includes(categoryId)) {
      setOpenCategories(openCategories.filter((id) => id !== categoryId));
    } else {
      setOpenCategories([...openCategories, categoryId]);
    }

    // fetch items only once
    if (!categoryItems[categoryId]) {
      const res = await fetch(
        `https://localhost:44376/api/FoodItem/get-item-names?categoryId=${categoryId}`
      );
      const data = await res.json();

      setCategoryItems((prev) => ({
        ...prev,
        [categoryId]: data,
      }));
    }
  };

  // 🔹 SELECT CATEGORY (ALL ITEMS)
  const selectCategory = async (categoryId: number) => {
  let items = categoryItems[categoryId];

  // fetch if not loaded
  if (!items) {
    const res = await fetch(
      `https://localhost:44376/api/FoodItem/get-item-names?categoryId=${categoryId}`
    );
    items = await res.json();

    setCategoryItems((prev) => ({
      ...prev,
      [categoryId]: items,
    }));
  }

  const alreadySelected = selectedItems.some(
    (i) => i.categoryId === categoryId
  );

  if (alreadySelected) {
    // ❌ REMOVE all items of category
    setSelectedItems((prev) =>
      prev.filter((i) => i.categoryId !== categoryId)
    );
  } else {
    // ✅ ADD all items
    const newItems = items.map((item: any) => ({
      itemId: item.item_id,
      categoryId: categoryId,
    }));

    setSelectedItems((prev) => [...prev, ...newItems]);
  }
};
  // 🔹 SELECT SINGLE ITEM
  const selectItem = (item: any) => {
  setSelectedItems((prev) => {
    const exists = prev.some(
      (i) =>
        i.itemId === item.itemId &&
        i.categoryId === item.categoryId
    );

    if (exists) {
      // ❌ REMOVE item
      return prev.filter(
        (i) =>
          !(
            i.itemId === item.itemId &&
            i.categoryId === item.categoryId
          )
      );
    }

    // ✅ ADD item
    return [...prev, item];
  });
};
  // 🔹 SAVE DATA
  const handleSave = async () => {
    const timingPayload = timings
      .filter((t) => t.checked)
      .map((t) => ({
        shopId: 1,
        menuId,
        daysName: t.day,
        openTime: t.start,
        closeTime: t.end,
        closeDay: t.type === "close" ? 1 : 0,
        fullDay: t.type === "24" ? 1 : 0,
      }));

    await fetch(
      "https://localhost:44376/api/FoodMenu/insert-timings",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(timingPayload),
      }
    );

    const itemPayload = selectedItems.map((i) => ({
      shopId: 1,
      menuId,
      categoryId: i.categoryId,
      itemId: i.itemId,
      sizeId: 0,
      price: 0,
      totalPrice: 0,
    }));

    await fetch(
      "https://localhost:44376/api/FoodMenu/insert-items",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemPayload),
      }
    );

    Swal.fire("Success", "Menu Created Successfully", "success");
    router.push("/additional_menu/display");
  };

  return (
    <div className="container">
      <h2>Add New Shop Menu</h2>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="card">
          <h3>Menu Information</h3>

          <input
            type="text"
            placeholder="Menu Name"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
          />

          <h4>Menu Display Time *</h4>

          {timings.map((t, index) => (
            <div className="day-row" key={t.day}>
              <input
                type="checkbox"
                checked={t.checked}
                onChange={(e) => {
                  const newData = [...timings];
                  newData[index].checked = e.target.checked;
                  setTimings(newData);
                }}
              />

              <label>{t.day} :</label>

              <div className="radio-group">
                <input
                  type="radio"
                  checked={t.type === "close"}
                  onChange={() => {
                    const newData = [...timings];
                    newData[index].type = "close";
                    setTimings(newData);
                  }}
                />{" "}
                Close

                <input
                  type="radio"
                  checked={t.type === "24"}
                  onChange={() => {
                    const newData = [...timings];
                    newData[index].type = "24";
                    setTimings(newData);
                  }}
                />{" "}
                24 Hrs

                <input
                  type="radio"
                  checked={t.type === "timing"}
                  onChange={() => {
                    const newData = [...timings];
                    newData[index].type = "timing";
                    setTimings(newData);
                  }}
                />{" "}
                Timings
              </div>

              <input
                type="time"
                disabled={t.type !== "timing"}
                onChange={(e) => {
                  const newData = [...timings];
                  newData[index].start = e.target.value;
                  setTimings(newData);
                }}
              />

              <span> To </span>

              <input
                type="time"
                disabled={t.type !== "timing"}
                onChange={(e) => {
                  const newData = [...timings];
                  newData[index].end = e.target.value;
                  setTimings(newData);
                }}
              />
            </div>
          ))}

          <button className="next-btn" onClick={handleNext}>
            NEXT
          </button>

          <button
    className="cancel-btn"
    onClick={() => router.push("/additional_menu/display")}
  >
    CANCEL
  </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="card">
          <h3>Set Items For Menu: {menuName}</h3>

          <div style={{ marginBottom: "15px" }}>
  <button
  className="next-btn"
  onClick={async () => {
    const allIds = categories.map(c => c.categoryId);

    // 🔥 Fetch items for all categories
    const newItems = { ...categoryItems };

    for (let cat of categories) {
      if (!newItems[cat.categoryId]) {
        const res = await fetch(
          `https://localhost:44376/api/FoodItem/get-item-names?categoryId=${cat.categoryId}`
        );
        const data = await res.json();
        newItems[cat.categoryId] = data;
      }
    }

    setCategoryItems(newItems);

    // 🔥 Expand all
    setOpenCategories(allIds);
  }}
>
  EXPAND ALL
</button>

  <button
    className="cancel-btn"
    onClick={() => setOpenCategories([])}
  >
    COLLAPSE ALL
  </button>
</div>

         {categories.map((cat) => (
  <div key={cat.categoryId} className="category-box">

    <div className="category-header">

      {/* LEFT SIDE */}
      <div className="left-section">
        <input
          type="checkbox"
          checked={selectedItems.some(
            (i) => i.categoryId === cat.categoryId
          )}
          onChange={() => selectCategory(cat.categoryId)}
        />

        <span className="cat-name">{cat.categoryName}</span>
      </div>

      {/* RIGHT ICON */}
      <span
        className={`dropdown-icon ${
          openCategories.includes(cat.categoryId) ? "rotate" : ""
        }`}
        onClick={() => toggleCategory(cat.categoryId)}
      >
        ▼
      </span>
    </div>

    {/* ITEMS */}
    {openCategories.includes(cat.categoryId) && (
      <div className="item-list">
        {(categoryItems[cat.categoryId] || []).map((item: any) => (
          <div key={item.item_id} className="item-row">

            <input
              type="checkbox"
              checked={selectedItems.some(
                (i) =>
                  i.itemId === item.item_id &&
                  i.categoryId === cat.categoryId
              )}
              onChange={() =>
                selectItem({
                  itemId: item.item_id,
                  categoryId: cat.categoryId,
                })
              }
            />

            <span>{item.item_name}</span>
          </div>
        ))}
      </div>
    )}
  </div>
))}

          <button className="next-btn" onClick={handleSave}>
            SAVE
          </button>

            <button
    className="cancel-btn"
    onClick={() => router.push("/additional_menu/display")}
  >
    CANCEL
  </button>
        </div>
      )}
    </div>
  );
}