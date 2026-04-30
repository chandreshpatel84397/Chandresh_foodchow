import "./show_category.css";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: "40px", background: "#f4f5f7", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
