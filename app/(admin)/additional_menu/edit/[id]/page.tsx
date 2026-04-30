"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./style.css";
import Swal from "sweetalert2";
import { useParams } from "next/navigation";

const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Page() {
  const router = useRouter();
    const { id } = useParams();

  const [step, setStep] = useState(1);
  const [menuName, setMenuName] = useState("");
  const [menuId, setMenuId] = useState<number>(0);

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
  const [categoryItems, setCategoryItems] = useState<any>({});
  const [openCategories, setOpenCategories] = useState<number[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  // 🔥 LOAD DATA

  useEffect(() => {
  const loadSelectedCategoryItems = async () => {
    const newItems = { ...categoryItems };

    for (let i of selectedItems) {
      if (!newItems[i.categoryId]) {
        const res = await fetch(
          `https://localhost:44376/api/FoodItem/get-item-names?categoryId=${i.categoryId}`
        );
        const data = await res.json();
        newItems[i.categoryId] = data;
      }
    }

    setCategoryItems(newItems);
  };

  if (selectedItems.length > 0) {
    loadSelectedCategoryItems();
  }
}, [selectedItems]);


  useEffect(() => {
    if (!id) return;

    // MENU
    fetch(`https://localhost:44376/api/FoodMenu/get-by-id/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMenuName(data.menuName);
        setMenuId(Number(id));
      });

    // CATEGORIES
    fetch("https://localhost:44376/api/FoodCategory/getall")
      .then((res) => res.json())
      .then((data) => setCategories(data));

    // TIMINGS ✅ FIXED
    fetch(`https://localhost:44376/api/FoodMenu/get-timings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("TIMINGS:", data);

        const updated = daysList.map((day) => ({
          day,
          checked: false,
          type: "close",
          start: "",
          end: "",
        }));

       data.forEach((t: any) => {
  const index = updated.findIndex(
    (d) => d.day === t.daysName // ✅ FIX
  );

  if (index !== -1) {
    updated[index].checked = true;

    updated[index].start = t.openTime || "";
    updated[index].end = t.closeTime || "";

    if (t.closeDay === 1) {
      updated[index].type = "close";
    } else if (t.fullDay === 1) {
      updated[index].type = "24";
    } else {
      updated[index].type = "timing";
    }
  }
});

        setTimings(updated);
      });

    // ITEMS ✅ FIXED
    fetch(`https://localhost:44376/api/FoodMenu/get-items/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("ITEMS:", data);

        const formatted = data.map((i: any) => ({
         itemId: i.itemId,
        categoryId: i.categoryId
        }));

        setSelectedItems(formatted);
      });

  }, [id]);

  // 🔥 AUTO OPEN CATEGORIES
  useEffect(() => {
    if (selectedItems.length > 0) {
      const ids = [
        ...new Set(selectedItems.map((i) => i.categoryId))
      ];
      setOpenCategories(ids);
    }
  }, [selectedItems]);

  // 🔹 TOGGLE CATEGORY
  const toggleCategory = async (categoryId: number) => {
    if (openCategories.includes(categoryId)) {
      setOpenCategories(openCategories.filter((id) => id !== categoryId));
    } else {
      setOpenCategories([...openCategories, categoryId]);
    }

    if (!categoryItems[categoryId]) {
      const res = await fetch(
        `https://localhost:44376/api/FoodItem/get-item-names?categoryId=${categoryId}`
      );
      const data = await res.json();

      setCategoryItems((prev: any) => ({
        ...prev,
        [categoryId]: data,
      }));
    }
  };

  // 🔹 SELECT ITEM
  const selectItem = (item: any) => {
  setSelectedItems((prev) => {
    const exists = prev.some(
      (i) =>
        i.itemId === item.itemId &&
        i.categoryId === item.categoryId
    );

    if (exists) {
      // ❌ REMOVE item (uncheck)
      return prev.filter(
        (i) =>
          !(
            i.itemId === item.itemId &&
            i.categoryId === item.categoryId
          )
      );
    } else {
      // ✅ ADD item (check)
      return [...prev, item];
    }
  });
};

  // 🔥 UPDATE MENU
  const handleNext = async () => {
    await fetch(
      `https://localhost:44376/api/FoodMenu/update-menu/${id}`,
      {
        method: "PUT",
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

    setStep(2);
  };
const toggleCategorySelect = async (cat: any) => {
  let items = categoryItems[cat.categoryId];

  if (!items) {
    const res = await fetch(
      `https://localhost:44376/api/FoodItem/get-item-names?categoryId=${cat.categoryId}`
    );
    items = await res.json();

    setCategoryItems((prev: any) => ({
      ...prev,
      [cat.categoryId]: items,
    }));
  }

  const alreadySelected = selectedItems.some(
    (i) => i.categoryId === cat.categoryId
  );

  if (alreadySelected) {
    // ❌ remove all items of category
    setSelectedItems((prev) =>
      prev.filter((i) => i.categoryId !== cat.categoryId)
    );
  } else {
    // ✅ add all items of category
    const newItems = items.map((item: any) => ({
      itemId: item.item_id,
      categoryId: cat.categoryId,
    }));

    setSelectedItems((prev) => [...prev, ...newItems]);
  }
};
  // 🔥 SAVE
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
      `https://localhost:44376/api/FoodMenu/update-timings/${menuId}`,
      {
        method: "PUT",
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
      `https://localhost:44376/api/FoodMenu/update-items/${menuId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemPayload),
      }
    );

    Swal.fire("Success", "Menu Updated Successfully", "success");
    router.push("/additional_menu/display");
    
  };

  return (
    <div className="container">
      <h2>Edit Shop Menu</h2>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="card">
          <input
            type="text"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
          />

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
                24

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
                value={t.start}
                onChange={(e) => {
                  const newData = [...timings];
                  newData[index].start = e.target.value;
                  setTimings(newData);
                }}
              />
              <span> To </span>

              <input
                type="time"
                value={t.end}
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
        </div>
      )}

      {/* STEP 2 */}


      {step === 2 && (

        <div className="card">

          <div style={{ marginBottom: "15px" }}>
  <button
    className="next-btn"
    onClick={async () => {
      const allIds = categories.map(c => c.categoryId);

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
        onChange={() => toggleCategorySelect(cat)}
      />

      <span className="cat-name">
        {cat.categoryName}
      </span>
    </div>

    {/* RIGHT ARROW */}
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
</div>          ))}

          <button className="next-btn" onClick={handleSave}>
            UPDATE
          </button>
        </div>
      )}
    </div>
  );
}