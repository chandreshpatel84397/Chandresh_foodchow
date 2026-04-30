import "./add_category.css";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: "40px" }}>
      {children}
    </div>
  );
}
