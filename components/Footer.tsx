export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--cyan-border)",
        background: "var(--bg)",
      }}
      className="py-8 text-center"
    >
      <p style={{ color: "var(--ink-3)", fontSize: "11px" }}>
        © 2026 Clarix — Private Members Club. All rights reserved.
      </p>
    </footer>
  );
}
