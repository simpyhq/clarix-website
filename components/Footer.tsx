export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(201,168,76,0.12)",
        background: "var(--bg)",
      }}
      className="py-8 text-center"
    >
      <p style={{ color: "var(--ink-3)", fontSize: "11px" }}>
        © 2025 Clarix. Private &amp; Confidential.
      </p>
    </footer>
  );
}
