"use client";

import "../../add/insertDeals/dealform.css";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

// ── Types ──────────────────────────────────────────────────────────────
interface CategoryItem {
  item_id: number;
  item_name: string;
}

interface CategoryWithItems {
  categoryId: number;
  categoryName: string;
  items: CategoryItem[];
  expanded: boolean;
}

interface ItemGroup {
  id: number;
  selectedItems: { categoryId: number; itemId: number; itemName: string; categoryName: string }[];
  popupOpen: boolean;
  popupCategories: CategoryWithItems[];
  popupCheckedItems: { categoryId: number; itemId: number }[];
}

interface TaxOption {
  food_shop_tax_id: number;
  tax_name: string;
  tax_percentage: number;
  is_active: boolean;
  tax_type: number; // 1=Inclusive, 0=Exclusive
}

export default function EditDealPage() {
  const params = useParams();
  const router = useRouter();
  const dealId = params?.id as string;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    dealName: "",
    dealTypeId: 0,
    shopId: 1,
    dealDesc: "",
    dealImage: "",
    dealPrice: "",
    dealMRP: "",
    status: 1,
    percentDiscountOnCart: 0,
    minOrder: 1,
    validOrderMethod: [] as string[],
    validPaymentMethod: [] as string[],
    applyDiscount: 0,
  });

  // ── Tax state ──────────────────────────────────────────────────────
  // 0 = Exclusive, 1 = Inclusive
  const [taxes, setTaxes] = useState<TaxOption[]>([]);
  const [taxPopupOpen, setTaxPopupOpen] = useState(false);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalDealPrice, setTotalDealPrice] = useState(0);
  const [selectedTaxes, setSelectedTaxes] = useState<TaxOption[]>([]);
  const [taxType, setTaxType] = useState<0 | 1>(0); // 0=Exclusive, 1=Inclusive

  // ── Categories ─────────────────────────────────────────────────────
  const [categories, setCategories] = useState<{ categoryId: number; categoryName: string }[]>([]);

  // ── Item Groups ────────────────────────────────────────────────────
  const [itemGroups, setItemGroups] = useState<ItemGroup[]>([
    { id: 1, selectedItems: [], popupOpen: false, popupCategories: [], popupCheckedItems: [] },
    { id: 2, selectedItems: [], popupOpen: false, popupCategories: [], popupCheckedItems: [] },
    { id: 3, selectedItems: [], popupOpen: false, popupCategories: [], popupCheckedItems: [] },
  ]);

  // ── Load master data + deal data ───────────────────────────────────
  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);

        const [catRes, taxRes] = await Promise.all([
          fetch("https://localhost:44376/api/FoodCategory/getall"),
          fetch("https://localhost:44376/api/FoodShopTax/getall"),
        ]);

        const catData = await catRes.json();
        const taxData = await taxRes.json();
// Force tax_type to number to avoid string vs number mismatch
const normalizedTaxData = taxData.map((t: TaxOption) => ({
  ...t,
  tax_type: Number(t.tax_type),
  is_active: Boolean(t.is_active),
}));
setTaxes(normalizedTaxData);
        setCategories(catData);
        
        

        if (dealId) {
          const dealRes = await fetch(
            `https://localhost:44376/api/FoodDeal/get-by-id/${dealId}`
          );
          if (!dealRes.ok) throw new Error("Failed to fetch deal");
          const data = await dealRes.json();

          setFormData({
            dealName: data.dealName || "",
            dealTypeId: data.dealTypeId || 0,
            shopId: data.shopId || 1,
            dealDesc: data.dealDesc || "",
            dealImage: data.dealImage || "",
            dealPrice: data.dealPrice?.toString() || "",
            dealMRP: data.dealMRP?.toString() || "",
            status: data.status ?? 1,
            percentDiscountOnCart: data.percentDiscountOnCart || 0,
            minOrder: data.minOrder || 1,
            validOrderMethod: data.validOrderMethod
              ? data.validOrderMethod.split(",").map((x: string) => x.trim()).filter(Boolean)
              : [],
            validPaymentMethod: data.validPaymentMethod
              ? data.validPaymentMethod.split(",").map((x: string) => x.trim()).filter(Boolean)
              : [],
            applyDiscount: data.applyDiscount || 0,
          });

          // ── Load tax for this deal ─────────────────────────────
          try {
            const dealTaxRes = await fetch(
              `https://localhost:44376/api/FoodDeal/get-tax/${dealId}`
            );
            if (dealTaxRes.ok) {
              const dealTaxData = await dealTaxRes.json();
              console.log("Tax API Response:", dealTaxData);

              if (dealTaxData && dealTaxData.length > 0) {
                const matchedTaxes = dealTaxData
  .map((dt: any) =>
    normalizedTaxData.find(
      (t: TaxOption) => Number(t.food_shop_tax_id) === Number(dt.taxId)
    )
  )
  .filter(Boolean);

                if (matchedTaxes.length > 0) {
                  setSelectedTaxes(matchedTaxes);
                  // tax_type from API: 0=Exclusive, 1=Inclusive
                  setTaxType(matchedTaxes[0].tax_type as 0 | 1);
                  const totalAmt = dealTaxData.reduce(
                    (sum: number, dt: any) => sum + dt.taxAmount,
                    0
                  );
                  setTaxAmount(parseFloat(totalAmt.toFixed(2)));
                }
              }
            }
          } catch { /* tax not found, skip */ }

          // ── Load item groups for this deal ─────────────────────
          try {
            const groupsRes = await fetch(
              `https://localhost:44376/api/FoodDeal/get-groups/${dealId}`
            );
            if (groupsRes.ok) {
              const groupsData = await groupsRes.json();
              console.log("Groups API Response:", JSON.stringify(groupsData, null, 2));

              if (groupsData && groupsData.length > 0) {
                const loadedGroups: ItemGroup[] = [];
                for (let i = 0; i < Math.max(groupsData.length, 3); i++) {
                  const groupData = groupsData[i];
                  if (groupData) {
                    loadedGroups.push({
                      id: i + 1,
                      selectedItems: groupData.items.map((item: any) => ({
                        categoryId: item.categoryId,
                        itemId: item.itemId,
                        categoryName: item.categoryName || `Category ${item.categoryId}`,
                        itemName: item.itemName || `Item ${item.itemId}`,
                      })),
                      popupOpen: false,
                      popupCategories: [],
                      popupCheckedItems: groupData.items.map((item: any) => ({
                        categoryId: item.categoryId,
                        itemId: item.itemId,
                      })),
                    });
                  } else {
                    loadedGroups.push({
                      id: i + 1,
                      selectedItems: [],
                      popupOpen: false,
                      popupCategories: [],
                      popupCheckedItems: [],
                    });
                  }
                }
                setItemGroups(loadedGroups);
              }
            }
          } catch { /* groups not found, use default */ }
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to load deal details", "error");
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [dealId]);

  // ── Recalculate tax on price/tax change ────────────────────────────
  // 0 = Exclusive (tax added on top), 1 = Inclusive (tax inside price)
  useEffect(() => {
    const price = Number(formData.dealPrice) || 0;
    if (selectedTaxes.length > 0 && price > 0) {
      const totalTaxPct = selectedTaxes.reduce((sum, t) => sum + t.tax_percentage, 0);
      let amt = 0;
      let total = 0;
      if (taxType === 0) {
        // Exclusive: tax added ON TOP of price
        amt = parseFloat(((price * totalTaxPct) / 100).toFixed(2));
        total = parseFloat((price + amt).toFixed(2));
      } else {
        // Inclusive: tax already INSIDE price
        amt = parseFloat((price - (price * 100) / (100 + totalTaxPct)).toFixed(2));
        total = price;
      }
      setTaxAmount(amt);
      setTotalDealPrice(total);
    } else {
      setTaxAmount(0);
      setTotalDealPrice(price);
    }
  }, [formData.dealPrice, selectedTaxes, taxType]);

  // ── Item group popup ───────────────────────────────────────────────
  const openPopup = async (groupId: number) => {
    const group = itemGroups.find((g) => g.id === groupId)!;
    const popupCats: CategoryWithItems[] = categories.map((c) => ({
      categoryId: c.categoryId,
      categoryName: c.categoryName,
      items: [],
      expanded: false,
    }));

    const preChecked = group.selectedItems.map((s) => ({
      categoryId: s.categoryId,
      itemId: s.itemId,
    }));

    const savedCategoryIds = [...new Set(group.selectedItems.map((s) => s.categoryId))];
    const updatedCats = await Promise.all(
      popupCats.map(async (cat) => {
        if (savedCategoryIds.includes(cat.categoryId)) {
          try {
            const res = await fetch(
              `https://localhost:44376/api/FoodItem/get-item-names?categoryId=${cat.categoryId}`
            );
            const items: CategoryItem[] = await res.json();
            return { ...cat, items, expanded: true };
          } catch {
            return { ...cat, expanded: true };
          }
        }
        return cat;
      })
    );

    setItemGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, popupOpen: true, popupCategories: updatedCats, popupCheckedItems: preChecked }
          : g
      )
    );
  };

  const closePopup = (groupId: number) => {
    setItemGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, popupOpen: false } : g))
    );
  };

  const toggleCategory = async (groupId: number, catIndex: number) => {
    const group = itemGroups.find((g) => g.id === groupId)!;
    const cat = group.popupCategories[catIndex];
    let items = cat.items;
    if (items.length === 0) {
      try {
        const res = await fetch(
          `https://localhost:44376/api/FoodItem/get-item-names?categoryId=${cat.categoryId}`
        );
        items = await res.json();
      } catch { items = []; }
    }
    setItemGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const updatedCats = g.popupCategories.map((c, i) =>
          i === catIndex ? { ...c, expanded: !c.expanded, items } : c
        );
        return { ...g, popupCategories: updatedCats };
      })
    );
  };

  const toggleCategoryCheck = async (e: React.MouseEvent, groupId: number, catIndex: number) => {
    e.stopPropagation();
    const group = itemGroups.find((g) => g.id === groupId)!;
    const cat = group.popupCategories[catIndex];
    let items = cat.items;
    if (items.length === 0) {
      try {
        const res = await fetch(
          `https://localhost:44376/api/FoodItem/get-item-names?categoryId=${cat.categoryId}`
        );
        items = await res.json();
      } catch { items = []; }
    }
    const allChecked = items.length > 0 && items.every((item) =>
      group.popupCheckedItems.some(
        (ci) => ci.categoryId === cat.categoryId && ci.itemId === item.item_id
      )
    );
    setItemGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const updatedCats = g.popupCategories.map((c, i) =>
          i === catIndex ? { ...c, items, expanded: true } : c
        );
        let updatedChecked = g.popupCheckedItems.filter((ci) => ci.categoryId !== cat.categoryId);
        if (!allChecked) {
          updatedChecked = [
            ...updatedChecked,
            ...items.map((item) => ({ categoryId: cat.categoryId, itemId: item.item_id })),
          ];
        }
        return { ...g, popupCategories: updatedCats, popupCheckedItems: updatedChecked };
      })
    );
  };

  const toggleItemCheck = (e: React.MouseEvent, groupId: number, categoryId: number, itemId: number) => {
    e.stopPropagation();
    setItemGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const exists = g.popupCheckedItems.some(
          (ci) => ci.categoryId === categoryId && ci.itemId === itemId
        );
        const updatedChecked = exists
          ? g.popupCheckedItems.filter(
              (ci) => !(ci.categoryId === categoryId && ci.itemId === itemId)
            )
          : [...g.popupCheckedItems, { categoryId, itemId }];
        return { ...g, popupCheckedItems: updatedChecked };
      })
    );
  };

  const savePopup = (groupId: number) => {
    const group = itemGroups.find((g) => g.id === groupId)!;
    const selected = group.popupCheckedItems.map((ci) => {
      const cat = group.popupCategories.find((c) => c.categoryId === ci.categoryId);
      const item = cat?.items.find((it) => it.item_id === ci.itemId);
      return {
        categoryId: ci.categoryId,
        itemId: ci.itemId,
        categoryName: cat?.categoryName ?? "",
        itemName: item?.item_name ?? "",
      };
    });
    setItemGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, selectedItems: selected, popupOpen: false } : g
      )
    );
  };

  const addItemGroup = () => {
    const newId = Math.max(...itemGroups.map((g) => g.id)) + 1;
    setItemGroups((prev) => [
      ...prev,
      { id: newId, selectedItems: [], popupOpen: false, popupCategories: [], popupCheckedItems: [] },
    ]);
  };

  const removeItemGroup = (groupId: number) => {
    if (groupId <= 2) return;
    setItemGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  // ── Tax ────────────────────────────────────────────────────────────
  const handleRemoveTax = () => {
    setSelectedTaxes([]);
    setTaxAmount(0);
    setTotalDealPrice(Number(formData.dealPrice) || 0);
  };

  // Helper: per-tax amount for breakdown display
  // 0 = Exclusive, 1 = Inclusive
  const getPerTaxAmount = (tax: TaxOption, price: number): number => {
    if (taxType === 0) {
      return (price * tax.tax_percentage) / 100;
    } else {
      return price - (price * 100) / (100 + tax.tax_percentage);
    }
  };

  // ── Navigation ─────────────────────────────────────────────────────
  const nextStep = () => {
    if (step === 1 && (!formData.dealName || !formData.dealDesc)) {
      Swal.fire("Error", "Please fill required fields", "error");
      return;
    }
    if (step === 2) {
      if (!formData.dealPrice) {
        Swal.fire("Error", "Please enter Deal Price", "error");
        return;
      }
      if (Number(formData.dealMRP) < Number(formData.dealPrice)) {
        Swal.fire("Invalid Price", "Deal MRP cannot be less than Deal Price", "error");
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => { if (step > 1) setStep(step - 1); };

  // ── Submit ─────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const dealGroups = itemGroups
      .filter((g) => g.selectedItems.length > 0)
      .map((g, idx) => ({
        groupNo: idx + 1,
        items: g.selectedItems.map((s) => ({
          categoryId: s.categoryId,
          itemId: s.itemId,
        })),
      }));

    const payload = {
      dealName: formData.dealName,
      dealTypeId: Number(formData.dealTypeId),
      shopId: Number(formData.shopId),
      dealDesc: formData.dealDesc,
      dealImage: formData.dealImage || "",
      dealPrice: Number(formData.dealPrice),
      dealMRP: Number(formData.dealMRP),
      totalDealPrice: totalDealPrice,
      status: Number(formData.status),
      percentDiscountOnCart: Number(formData.percentDiscountOnCart),
      validOrderMethod: formData.validOrderMethod.join(","),
      validPaymentMethod: formData.validPaymentMethod.join(","),
      applyDiscount: Number(formData.applyDiscount),
      minOrder: Number(formData.minOrder),
      dealItems: [],
      dealGroups,
      taxIds: selectedTaxes.map((t) => t.food_shop_tax_id),
      taxType: taxType,   // 0 = Exclusive, 1 = Inclusive
      taxAmount: taxAmount,
    };

    try {
      const res = await fetch(
        `https://localhost:44376/api/FoodDeal/update/${dealId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const responseText = await res.text();
      if (res.ok) {
        Swal.fire("Success", "Deal Updated Successfully", "success").then(() =>
          router.push("/item_deals/Deals/display")
        );
      } else {
        Swal.fire("Error", `${res.status}: ${responseText}`, "error");
      }
    } catch (error: any) {
      Swal.fire("Error", `Network error: ${error.message}`, "error");
    }
  };

  if (loading) {
    return (
      <div className="outer-wrapper">
        <div className="main-card">
          <p>Loading deal data...</p>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="outer-wrapper">
      <div className="main-card">
        <h2 className="page-title">UPDATE DEAL</h2>
        <p className="selected-type">
          <strong>Selected Deal Type</strong><br />
          {formData.dealTypeId === 0 ? "Meal Deal" : formData.dealTypeId}
        </p>

        {/* STEPPER */}
        <div className="stepper">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className={`step-box ${step >= num ? "active" : ""}`}>{num}</div>
          ))}
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="section-card">
            <h3 className="section-title">Set Deal Basic Info</h3>
            <label>Deal Name *</label>
            <input type="text" value={formData.dealName}
              onChange={(e) => setFormData({ ...formData, dealName: e.target.value })} />
            <label>Description *</label>
            <textarea value={formData.dealDesc}
              onChange={(e) => setFormData({ ...formData, dealDesc: e.target.value })} />
            <label>Status</label>
            <div className="radio-group">
              <label>
                <input type="radio" checked={formData.status === 1}
                  onChange={() => setFormData({ ...formData, status: 1 })} />
                Active
              </label>
              <label>
                <input type="radio" checked={formData.status === 0}
                  onChange={() => setFormData({ ...formData, status: 0 })} />
                De-Active
              </label>
            </div>
            <div className="btn-row">
              <button className="btn-next" onClick={nextStep}>NEXT</button>
              <button className="btn-cancel" onClick={() => router.push("/item_deals/Deals/display")}>CANCEL</button>
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="section-card">
            <h3 className="section-title">Make Your Deal Here (What your Client Will Get)</h3>

            {/* WHITE CARD 1 — Item Groups */}
            <div className="s2-white-card">
              <p className="s2-card-title">Set which items are eligible</p>

              {itemGroups.map((group, idx) => {
                const count = group.selectedItems.length;
                const canRemove = group.id > 2;
                return (
                  <div key={group.id} className="ig-row">
                    <span className="ig-label">Item Group {idx + 1}:</span>
                    <div className="ig-input-box">
                      {count === 0 ? "0 Items Selected" : `${count} Item${count > 1 ? "s" : ""} Selected`}
                    </div>
                    <button className="ig-pencil-btn" onClick={() => openPopup(group.id)} title="Edit">✎</button>
                    {canRemove && (
                      <button className="ig-remove-btn" onClick={() => removeItemGroup(group.id)} title="Remove">✕</button>
                    )}

                    {/* POPUP */}
                    {group.popupOpen && (
                      <div className="popup-overlay" onClick={() => closePopup(group.id)}>
                        <div className="popup-box" onClick={(e) => e.stopPropagation()}>
                          <div className="popup-header">
                            <span className="popup-title">Add Item in Item group {idx + 1}</span>
                            <button className="popup-close-btn" onClick={() => closePopup(group.id)}>✕</button>
                          </div>
                          <div className="popup-body">
                            {group.popupCategories.map((cat, catIdx) => {
                              const allItemsLoaded = cat.items.length > 0;
                              const allChecked = allItemsLoaded && cat.items.every((it) =>
                                group.popupCheckedItems.some(
                                  (ci) => ci.categoryId === cat.categoryId && ci.itemId === it.item_id
                                )
                              );
                              const someChecked = allItemsLoaded && !allChecked && cat.items.some((it) =>
                                group.popupCheckedItems.some(
                                  (ci) => ci.categoryId === cat.categoryId && ci.itemId === it.item_id
                                )
                              );
                              return (
                                <div key={cat.categoryId} className="popup-cat-block">
                                  <div className="popup-cat-row" onClick={() => toggleCategory(group.id, catIdx)}>
                                    <input
                                      type="checkbox"
                                      className="popup-checkbox"
                                      checked={allChecked}
                                      ref={(el) => { if (el) el.indeterminate = someChecked; }}
                                      onChange={() => {}}
                                      onClick={(e) => toggleCategoryCheck(e, group.id, catIdx)}
                                    />
                                    <span className="popup-cat-name">{cat.categoryName}-</span>
                                    <span className="popup-expand-icon">{cat.expanded ? "▲" : "▼"}</span>
                                  </div>
                                  {cat.expanded && (
                                    <div className="popup-items-list">
                                      {cat.items.length === 0 ? (
                                        <div className="popup-loading">Loading items...</div>
                                      ) : (
                                        cat.items.map((item) => {
                                          const isChecked = group.popupCheckedItems.some(
                                            (ci) => ci.categoryId === cat.categoryId && ci.itemId === item.item_id
                                          );
                                          return (
                                            <div key={item.item_id} className="popup-item-row"
                                              onClick={(e) => toggleItemCheck(e, group.id, cat.categoryId, item.item_id)}>
                                              <input
                                                type="checkbox"
                                                className="popup-checkbox"
                                                checked={isChecked}
                                                onChange={() => {}}
                                                onClick={(e) => toggleItemCheck(e, group.id, cat.categoryId, item.item_id)}
                                              />
                                              <span className="popup-item-name">{item.item_name}-</span>
                                            </div>
                                          );
                                        })
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div className="popup-footer">
                            <button className="popup-btn-cancel" onClick={() => closePopup(group.id)}>✕ CANCEL</button>
                            <button className="popup-btn-save" onClick={() => savePopup(group.id)}>✔ SAVE</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <button className="btn-add-group" onClick={addItemGroup}>+ Add Item Group</button>
            </div>

            {/* WHITE CARD 2 — Hint */}
            <div className="s2-white-card" style={{ marginTop: "16px" }}>
              <p className="s2-card-title">Your deal offer:</p>
              <p className="s2-card-hint">
                Example: Buy a Pizza and cold drink would require you to select all Pizza for group 1 and all cold drinks for group 2.
              </p>
            </div>

            {/* WHITE CARD 3 — Pricing + Tax */}
            <div className="s2-white-card" style={{ marginTop: "16px" }}>
              <p className="s2-card-title">Set deal advantage to client:</p>

              <div className="s2-field-row">
                <label className="s2-inline-label">Buy this deal only @ Rs.</label>
                <input
                  type="number"
                  className="s2-inline-input"
                  value={formData.dealPrice}
                  onChange={(e) => setFormData({ ...formData, dealPrice: e.target.value })}
                />
                <button className="btn-select-tax" onClick={() => setTaxPopupOpen(true)}>SELECT TAX</button>
              </div>

              {/* Selected taxes badges */}
              {selectedTaxes.length > 0 && (
                <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {selectedTaxes.map((tax) => (
                    <div key={tax.food_shop_tax_id} className="tax-badge">
                      {/* 0=Exclusive, 1=Inclusive */}
                      <span>✔ {tax.tax_name} ({tax.tax_percentage}%) [{taxType === 1 ? "Incl." : "Excl."}]</span>
                      <button className="tax-badge-remove"
                        onClick={() => setSelectedTaxes((prev) =>
                          prev.filter((s) => s.food_shop_tax_id !== tax.food_shop_tax_id)
                        )}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Price breakdown */}
              {selectedTaxes.length > 0 && Number(formData.dealPrice) > 0 && (
                <div className="tax-breakdown">
                  <div className="tax-breakdown-row">
                    <span>Base Price:</span>
                    <span>Rs. {Number(formData.dealPrice).toFixed(2)}</span>
                  </div>
                  {selectedTaxes.map((tax) => {
                    const amt = getPerTaxAmount(tax, Number(formData.dealPrice));
                    return (
                      <div key={tax.food_shop_tax_id} className="tax-breakdown-row">
                        {/* 0=Exclusive, 1=Inclusive */}
                        <span>{tax.tax_name} ({tax.tax_percentage}%) [{taxType === 1 ? "Inclusive" : "Exclusive"}]:</span>
                        <span>{taxType === 0 ? "+" : "incl."} Rs. {amt.toFixed(2)}</span>
                      </div>
                    );
                  })}
                  <div className="tax-breakdown-row total">
                    <span>Total Price:</span>
                    <span>Rs. {totalDealPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="s2-field-row" style={{ marginTop: "12px" }}>
                <label className="s2-inline-label">Deal MRP Rs.</label>
                <input
                  type="number"
                  className="s2-inline-input"
                  value={formData.dealMRP}
                  onChange={(e) => setFormData({ ...formData, dealMRP: e.target.value })}
                />
              </div>

              <div className="s2-field-row">
                <label className="s2-inline-label">Minimum Order Quantity</label>
                <input
                  type="number"
                  className="s2-inline-input"
                  value={formData.minOrder}
                  onChange={(e) => setFormData({ ...formData, minOrder: Number(e.target.value) })}
                />
              </div>
            </div>

            {/* TAX POPUP */}
            {taxPopupOpen && (
              <div className="popup-overlay" onClick={() => setTaxPopupOpen(false)}>
                <div className="popup-box" onClick={(e) => e.stopPropagation()}>
                  <div className="popup-header">
                    <span className="popup-title">Select Tax</span>
                    <button className="popup-close-btn" onClick={() => setTaxPopupOpen(false)}>✕</button>
                  </div>
                  <div className="popup-body">

                    {/* Tax Type Radio Buttons — 0=Exclusive, 1=Inclusive */}
                    <div style={{ marginBottom: "14px", display: "flex", gap: "24px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 600 }}>
                        <input
                          type="radio"
                          checked={taxType === 0}
                          onChange={() => { setTaxType(0); setSelectedTaxes([]); }}
                        />
                        Exclusive Tax
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 600 }}>
                        <input
                          type="radio"
                          checked={taxType === 1}
                          onChange={() => { setTaxType(1); setSelectedTaxes([]); }}
                        />
                        Inclusive Tax
                      </label>
                    </div>

                    <hr style={{ marginBottom: "12px" }} />

                    {/* Filter taxes by taxType (0=Exclusive, 1=Inclusive) */}
                    {taxes.filter((t) => t.is_active && Number(t.tax_type) === Number(taxType)).length === 0 ? (
                      <p style={{ color: "#888", textAlign: "center" }}>No taxes available for this type</p>
                    ) : (
                      taxes.filter((t) => t.is_active && t.tax_type === taxType).map((tax) => {
                       const isChecked = selectedTaxes.some(
  (s) => Number(s.food_shop_tax_id) === Number(tax.food_shop_tax_id)
);
                        const toggleTax = () => {
                          setSelectedTaxes((prev) =>
                            isChecked
                              ? prev.filter((s) => Number(s.food_shop_tax_id) !== Number(tax.food_shop_tax_id))
                              : [...prev, tax]
                          );
                        };
                        return (
                          <div
                            key={tax.food_shop_tax_id}
                            className={`tax-option-row ${isChecked ? "tax-option-selected" : ""}`}
                            onClick={toggleTax}
                            style={{ cursor: "pointer" }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={toggleTax}
                              onClick={(e) => e.stopPropagation()}
                              style={{ marginRight: "10px", width: "16px", height: "16px" }}
                            />
                            <div className="tax-option-info">
                              <span className="tax-option-name">{tax.tax_name}</span>
                              <span className="tax-option-pct">{tax.tax_percentage}%</span>
                            </div>
                            {Number(formData.dealPrice) > 0 && (
                              <div className="tax-option-amount">
                                {/* 0=Exclusive: added on top, 1=Inclusive: already inside */}
                                {taxType === 0
                                  ? `+ Rs. ${((Number(formData.dealPrice) * tax.tax_percentage) / 100).toFixed(2)}`
                                  : `incl. Rs. ${(Number(formData.dealPrice) - (Number(formData.dealPrice) * 100) / (100 + tax.tax_percentage)).toFixed(2)}`
                                }
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="popup-footer">
                    <button className="popup-btn-cancel" onClick={() => setTaxPopupOpen(false)}>CLOSE</button>
                    <button className="popup-btn-save" onClick={() => setTaxPopupOpen(false)}>✔ APPLY</button>
                  </div>
                </div>
              </div>
            )}

            <div className="btn-row" style={{ marginTop: "20px" }}>
              <button className="btn-cancel" onClick={prevStep}>BACK</button>
              <button className="btn-next" onClick={nextStep}>NEXT</button>
              <button className="btn-cancel" onClick={() => router.push("/item_deals/Deals/display")}>CANCEL</button>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div className="section-card">
            <h3 className="section-title">Add restriction on order type & payment</h3>
            <label>Allowed order type:</label>
            <div className="checkbox-group">
              {["Dinein", "TakeAway", "HomeDelivery"].map((method) => (
                <label key={method}>
                  <input
                    type="checkbox"
                    checked={formData.validOrderMethod.includes(method)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...formData.validOrderMethod, method]
                        : formData.validOrderMethod.filter((m) => m !== method);
                      setFormData({ ...formData, validOrderMethod: updated });
                    }}
                  />
                  {method === "HomeDelivery" ? "Home Delivery" : method === "TakeAway" ? "Take Away / Pickup" : method}
                </label>
              ))}
            </div>

            <label>Allowed payment method:</label>
            <div className="checkbox-group">
              {["COD", "Online"].map((method) => (
                <label key={method}>
                  <input
                    type="checkbox"
                    checked={formData.validPaymentMethod.includes(method)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...formData.validPaymentMethod, method]
                        : formData.validPaymentMethod.filter((m) => m !== method);
                      setFormData({ ...formData, validPaymentMethod: updated });
                    }}
                  />
                  {method === "COD" ? "Cash on delivery" : "Online Payment"}
                </label>
              ))}
            </div>

            <label>Allow other discounts on this deal?</label>
            <div className="checkbox-group">
              <label>
                <input type="radio" checked={formData.applyDiscount === 1}
                  onChange={() => setFormData({ ...formData, applyDiscount: 1 })} /> Yes
              </label>
              <label>
                <input type="radio" checked={formData.applyDiscount === 0}
                  onChange={() => setFormData({ ...formData, applyDiscount: 0 })} /> No
              </label>
            </div>

            <div className="btn-row">
              <button className="btn-cancel" onClick={prevStep}>BACK</button>
              <button className="btn-next" onClick={nextStep}>NEXT</button>
              <button className="btn-cancel" onClick={() => router.push("/item_deals/Deals/display")}>CANCEL</button>
            </div>
          </div>
        )}

        {/* ── STEP 4 ── */}
        {step === 4 && (
          <div className="section-card">
            <h3 className="section-title">Final Step</h3>

            <div className="s2-white-card" style={{ marginBottom: "16px" }}>
              <p className="s2-card-title">Deal Summary</p>
              <div className="summary-row"><span>Deal Name:</span><span>{formData.dealName}</span></div>
              <div className="summary-row"><span>Deal Price:</span><span>Rs. {formData.dealPrice}</span></div>

              {selectedTaxes.length > 0 && (
                <>
                  {selectedTaxes.map((tax) => {
                    const amt = getPerTaxAmount(tax, Number(formData.dealPrice));
                    return (
                      <div key={tax.food_shop_tax_id} className="summary-row">
                        {/* 0=Exclusive, 1=Inclusive */}
                        <span>{tax.tax_name} ({tax.tax_percentage}%) [{taxType === 1 ? "Incl." : "Excl."}]:</span>
                        <span>{taxType === 0 ? "+" : "incl."} Rs. {amt.toFixed(2)}</span>
                      </div>
                    );
                  })}
                  <div className="summary-row total">
                    <span>Total Price:</span>
                    <span>Rs. {totalDealPrice.toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="summary-row"><span>Deal MRP:</span><span>Rs. {formData.dealMRP}</span></div>
              <div className="summary-row"><span>Min Order:</span><span>{formData.minOrder}</span></div>
              <div className="summary-row">
                <span>Item Groups:</span>
                <span>{itemGroups.filter(g => g.selectedItems.length > 0).length} group(s) configured</span>
              </div>
            </div>

            <p>⚠ A Final Step !! You are about to Update Your Deal.</p>
            <div className="btn-row">
              <button className="btn-cancel" onClick={prevStep}>BACK</button>
              <button className="btn-next" onClick={handleSubmit}>UPDATE DEAL</button>
              <button className="btn-cancel" onClick={() => router.push("/item_deals/Deals/display")}>CANCEL</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}