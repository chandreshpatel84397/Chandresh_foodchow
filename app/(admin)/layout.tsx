"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./admin.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <div className={styles.wrapper}>

      {/* ===== TOPBAR ===== */}
      <header className={styles.topbar}>
        <div className={styles.topLeft}>
          <span className={styles.topAdmin}>ADMIN</span>
          <button
            className={styles.menuBtn}
            onClick={() => {
              if (window.innerWidth <= 768) {
                setMobileOpen(!mobileOpen);
              } else {
                setSidebarOpen(!sidebarOpen);
              }
            }}
          >
            ☰
          </button>
        </div>

        <div className={styles.topRight}>
          <button className={styles.ticketBtn}>Create Support Ticket</button>
          <select className={styles.viewSelect}>
            <option>View</option>
          </select>
          <a href="/admin" className={styles.adminName}>Admin</a>
          <button className={styles.profileBtn}>👤 MY PROFILE ▾</button>
        </div>
      </header>

      {/* ===== BODY ===== */}
      <div className={styles.body}>

        {/* ===== BLACK ICON SIDEBAR ===== */}
        <aside className={styles.iconSidebar}>
          <a href="/dashboard" className={`${styles.iconItem} ${styles.iconActive}`}>
            <span className={styles.icon}>📦</span>
            <span>Setup</span>
          </a>
          <a href="/menu" className={styles.iconItem}>
            <span className={styles.icon}>🍴</span>
            <span>Menu</span>
          </a>
          <a href="/reports" className={styles.iconItem}>
            <span className={styles.icon}>📊</span>
            <span>Reports</span>
          </a>
          <a href="/marketing" className={styles.iconItem}>
            <span className={styles.icon}>📢</span>
            <span>Marketing</span>
          </a>
          <a href="/support" className={styles.iconItem}>
            <span className={styles.icon}>🛠</span>
            <span>Support</span>
          </a>
          <a href="/login" className={styles.iconItem} style={{ marginTop: "auto" }}>
            <span className={styles.icon}>🚪</span>
            <span>Logout</span>
          </a>
        </aside>

        {/* ===== WHITE SIDEBAR ===== */}
        <aside
          className={`${styles.sidebar} ${
            !sidebarOpen ? styles.sidebarClosed : ""
          } ${mobileOpen ? styles.mobileOpen : ""}`}
        >
          <span className={styles.setup}>Setup</span>
          <span className={styles.sectionLabel}>My Restaurant</span>

          <nav className={styles.menu}>
            <ul className={styles.menuList}>

              {[
                { href: "/dashboard", label: "Dashboard" },
                { href: "/admin", label: "My Profile" },
                { href: "/upload-menus", label: "Upload Menus" },
                { href: "/menu", label: "Menu Language" },
                { href: "/inside_folder/category", label: "Categories" },
                { href: "/variants", label: "Variants" },
                { href: "/display", label: "Choices" },
              ].map(({ href, label }) => (
                <li
                  key={href}
                  className={isActive(href) ? styles.activeItem : ""}
                >
                  <a href={href}>{label}</a>
                </li>
              ))}

              {/* Extras with sub-items */}
              <li
                className={
                  isActive("/extras-category/custom_category/show_category") ||
                  isActive("/extras")
                    ? styles.activeItem
                    : ""
                }
              >
                <span className={styles.extrasLabel}>Extras</span>
                <ul className={styles.submenuList}>
                  <li
                    className={
                      isActive("/extras-category/custom_category/show_category")
                        ? styles.activeSubItem
                        : ""
                    }
                  >
                    <a href="/extras-category/custom_category/show_category">
                      Extras Category
                    </a>
                  </li>
                  <li
                    className={
                      isActive("/extras") ? styles.activeSubItem : ""
                    }
                  >
                    <a href="/extras">Extras Name</a>
                  </li>
                </ul>
              </li>

              {[
                { href: "/Items", label: "Items" },
               
                { href: "/tax", label: "Tax" },
                { href: "/apply-tax", label: "Apply Tax" },
                { href: "/item_deals/Deals/display", label: "Item Deals" },
                { href: "/additional_menu/display", label: "Additional Menu" },
                // { href: "/order-setting", label: "Order Setting" },
                { href: "/category-mapper", label: "Category Mapper" },
              ].map(({ href, label }) => (
                <li
                  key={href}
                  className={isActive(href) ? styles.activeItem : ""}
                >
                  <a href={href}>{label}</a>
                </li>
              ))}

            </ul>
          </nav>
        </aside>

        {/* ===== OVERLAY (mobile) ===== */}
        {mobileOpen && (
          <div
            className={`${styles.overlay} ${styles.visible}`}
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* ===== MAIN CONTENT ===== */}
        <main
          className={`${styles.content} ${
            !sidebarOpen ? styles.contentExpanded : ""
          }`}
        >
          {children}
        </main>

      </div>
    </div>
  );
}