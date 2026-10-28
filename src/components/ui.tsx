import { useState } from "react"
import { T, ff } from "../tokens"

export function Btn({
  children,
  variant = "primary",
  size = "md",
  onClick,
  full,
  style,
  type = "button",
  disabled,
}: {
  children: React.ReactNode
  variant?: "primary" | "outline" | "ghost" | "soft" | "danger"
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  full?: boolean
  style?: React.CSSProperties
  type?: "button" | "submit"
  disabled?: boolean
}) {
  const base: React.CSSProperties = {
    borderRadius: 10,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.18s ease",
    fontFamily: ff.body,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: full ? "100%" : undefined,
    border: "none",
    lineHeight: 1,
    opacity: disabled ? 0.5 : 1,
  }
  const sz = {
    sm: { padding: "9px 18px", fontSize: 13 },
    md: { padding: "12px 24px", fontSize: 14 },
    lg: { padding: "15px 32px", fontSize: 15 },
  }
  const vr: Record<string, React.CSSProperties> = {
    primary: { background: T.purple, color: "#fff" },
    outline: {
      background: "transparent",
      color: T.purple,
      border: `1.5px solid ${T.purple}`,
    },
    ghost: { background: "transparent", color: T.purple },
    soft: { background: T.lilacLight, color: T.purple },
    danger: {
      background: T.dangerBg,
      color: T.danger,
      border: `1px solid #FCA5A5`,
    },
  }
  return (
    <button
      type={type}
      style={{ ...base, ...sz[size], ...vr[variant], ...style }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export function Card({
  children,
  style,
  hover,
  onClick,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
  hover?: boolean
  onClick?: () => void
}) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      data-eo-clickable={onClick ? "" : undefined}
      style={{
        background: T.white,
        borderRadius: 16,
        border: `1px solid ${T.border}`,
        boxShadow:
          hov && hover
            ? "0 8px 32px rgba(107,70,193,0.10)"
            : "0 1px 6px rgba(0,0,0,0.04)",
        transition: "all 0.2s ease",
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </div>
  )
}

export function Field({
  label,
  type = "text",
  placeholder,
  children,
  hint,
}: {
  label: string
  type?: string
  placeholder?: string
  children?: React.ReactNode
  hint?: string
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: T.text,
          fontFamily: ff.body,
        }}
      >
        {label}
      </label>
      {children ?? (
        <input
          type={type}
          placeholder={placeholder}
          style={{
            padding: "11px 14px",
            borderRadius: 10,
            border: `1.5px solid ${T.borderMid}`,
            fontSize: 14,
            color: T.text,
            outline: "none",
            fontFamily: ff.body,
            background: T.white,
            transition: "border 0.15s",
            width: "100%",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = T.lilac)}
          onBlur={(e) => (e.target.style.borderColor = T.borderMid)}
        />
      )}
      {hint && <p style={{ fontSize: 12, color: T.muted }}>{hint}</p>}
    </div>
  )
}

export function Textarea({
  label,
  placeholder,
  rows = 4,
  value,
  onChange,
  required,
}: {
  label?: string
  placeholder?: string
  rows?: number
  value?: string
  onChange?: (value: string) => void
  required?: boolean
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: T.text,
            fontFamily: ff.body,
          }}
        >
          {label}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        required={required}
        style={{
          padding: "11px 14px",
          borderRadius: 10,
          border: `1.5px solid ${T.borderMid}`,
          fontSize: 14,
          color: T.text,
          outline: "none",
          fontFamily: ff.body,
          resize: "vertical",
          boxSizing: "border-box",
          width: "100%",
        }}
        onFocus={(e) => (e.target.style.borderColor = T.lilac)}
        onBlur={(e) => (e.target.style.borderColor = T.borderMid)}
      />
    </div>
  )
}

export function Select({
  label,
  options,
  style,
  value,
  onChange,
}: {
  label?: string
  options: string[]
  style?: React.CSSProperties
  value?: string
  onChange?: (value: string) => void
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: T.text,
            fontFamily: ff.body,
          }}
        >
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        style={{
          padding: "11px 14px",
          borderRadius: 10,
          border: `1.5px solid ${T.borderMid}`,
          fontSize: 14,
          fontFamily: ff.body,
          outline: "none",
          background: T.white,
          color: T.text,
          ...style,
        }}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  )
}

export function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 16px",
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: ff.body,
        transition: "all 0.15s",
        background: active ? T.purple : T.white,
        color: active ? "#fff" : T.muted,
        border: `1.5px solid ${active ? T.purple : T.border}`,
      }}
    >
      {label}
    </button>
  )
}

export function Tag({
  label,
  color = "purple",
}: {
  label: string
  color?: "purple" | "green" | "amber" | "red" | "gray"
}) {
  const c: Record<string, [string, string]> = {
    purple: [T.lilacFaint, T.purple],
    green: [T.successBg, T.success],
    amber: [T.warningBg, T.warning],
    red: [T.dangerBg, T.danger],
    gray: ["#F3F4F6", "#6B7280"],
  }
  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        background: c[color][0],
        color: c[color][1],
        display: "inline-block",
        letterSpacing: "0.2px",
      }}
    >
      {label}
    </span>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 16,
      }}
    >
      <div
        style={{ width: 24, height: 2, background: T.purple, borderRadius: 1 }}
      />
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: T.purple,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
    </div>
  )
}

export function H1({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <h1
      style={{
        fontFamily: ff.heading,
        fontSize: "clamp(30px, 4vw, 52px)",
        fontWeight: 700,
        color: T.text,
        lineHeight: 1.12,
        letterSpacing: "-0.7px",
        ...style,
      }}
    >
      {children}
    </h1>
  )
}
export function H2({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <h2
      style={{
        fontFamily: ff.heading,
        fontSize: "clamp(22px, 2.8vw, 36px)",
        fontWeight: 700,
        color: T.text,
        lineHeight: 1.2,
        letterSpacing: "-0.4px",
        ...style,
      }}
    >
      {children}
    </h2>
  )
}
export function H3({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <h3
      style={{
        fontFamily: ff.heading,
        fontSize: 18,
        fontWeight: 600,
        color: T.text,
        lineHeight: 1.35,
        ...style,
      }}
    >
      {children}
    </h3>
  )
}

export function Container({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", ...style }}
    >
      {children}
    </div>
  )
}

export function PageWrap({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        padding: "52px 32px",
        maxWidth: 1200,
        margin: "0 auto",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Alert({
  type = "info",
  children,
}: {
  type?: "info" | "success" | "warning" | "error"
  children: React.ReactNode
}) {
  const c = {
    info: [T.lilacFaint, T.purple, T.borderMid],
    success: [T.successBg, T.success, "#A7F3D0"],
    warning: [T.warningBg, T.warning, "#FDE68A"],
    error: [T.dangerBg, T.danger, "#FCA5A5"],
  }
  const [bg, col, border] = c[type]
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        padding: "12px 16px",
        borderRadius: 10,
        background: bg,
        border: `1px solid ${border}`,
      }}
    >
      <p
        style={{
          fontSize: 13,
          color: col,
          fontFamily: ff.body,
          lineHeight: 1.55,
        }}
      >
        {children}
      </p>
    </div>
  )
}

export function StatCard({
  label,
  value,
  sub,
  color = T.purple,
}: {
  label: string
  value: string | number
  sub?: string
  color?: string
}) {
  return (
    <Card style={{ padding: 24 }}>
      <p
        style={{
          fontFamily: ff.heading,
          fontWeight: 700,
          fontSize: 32,
          color,
          marginBottom: 4,
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{label}</p>
      {sub && (
        <p style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{sub}</p>
      )}
    </Card>
  )
}

export function ProgressBar({
  label,
  value,
  max,
  color = T.purple,
}: {
  label: string
  value: number
  max: number
  color?: string
}) {
  const pct = Math.round((value / max) * 100)
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 13, color: T.text }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color }}>
          {value}/{max}
        </span>
      </div>
      <div style={{ height: 6, background: T.lilacLight, borderRadius: 3 }}>
        <div
          style={{
            height: "100%",
            background: color,
            borderRadius: 3,
            width: `${pct}%`,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  )
}

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 480,
          padding: 32,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <H3 style={{ fontSize: 17 }}>{title}</H3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.muted,
              fontSize: 20,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </Card>
    </div>
  )
}

export function UploadBox({ label = "Adicionar fotos" }: { label?: string }) {
  return (
    <div
      style={{
        border: `2px dashed ${T.borderMid}`,
        borderRadius: 12,
        padding: "32px 24px",
        textAlign: "center",
        background: T.lilacFaint,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: T.white,
          border: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 12px",
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={T.lilac}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </div>
      <p style={{ fontSize: 14, color: T.muted, fontFamily: ff.body }}>
        {label}
      </p>
      <p style={{ fontSize: 12, color: T.lilacMid, marginTop: 4 }}>
        JPG, PNG, WEBP — max 10 MB
      </p>
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  subtitle,
  action,
  onAction,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
  action?: string
  onAction?: () => void
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: T.lilacFaint,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        {icon}
      </div>
      <H3 style={{ marginBottom: 8, fontSize: 17 }}>{title}</H3>
      {subtitle && (
        <p
          style={{
            color: T.muted,
            fontSize: 14,
            lineHeight: 1.65,
            maxWidth: 320,
            marginBottom: action ? 24 : 0,
          }}
        >
          {subtitle}
        </p>
      )}
      {action && (
        <Btn size="sm" onClick={onAction}>
          {action}
        </Btn>
      )}
    </div>
  )
}

export function LoadingSkeleton({
  lines = 3,
  height,
  width,
  style,
}: {
  lines?: number
  height?: number
  width?: string
  style?: React.CSSProperties
}) {
  if (height !== undefined) {
    return (
      <div
        style={{
          height,
          width: width ?? "100%",
          borderRadius: 8,
          background: `linear-gradient(90deg, ${T.lilacFaint}, ${T.lilacLight}, ${T.lilacFaint})`,
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
          ...style,
        }}
      >
        <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      </div>
    )
  }
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 10, ...style }}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 16,
            borderRadius: 8,
            background: `linear-gradient(90deg, ${T.lilacFaint}, ${T.lilacLight}, ${T.lilacFaint})`,
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
            width: i === lines - 1 ? "60%" : "100%",
          }}
        />
      ))}
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  )
}

export function Badge({
  children,
  color = "purple",
}: {
  children: React.ReactNode
  color?: "purple" | "green" | "amber" | "red"
}) {
  const c: Record<string, [string, string]> = {
    purple: [T.lilacFaint, T.purple],
    green: [T.successBg, T.success],
    amber: [T.warningBg, T.warning],
    red: [T.dangerBg, T.danger],
  }
  return (
    <span
      style={{
        padding: "2px 8px",
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 700,
        background: c[color][0],
        color: c[color][1],
        display: "inline-block",
      }}
    >
      {children}
    </span>
  )
}

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: T.lilacLight,
        border: `2px solid ${T.borderMid}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: ff.heading,
          fontWeight: 700,
          fontSize: size * 0.35,
          color: T.purple,
        }}
      >
        {initials}
      </span>
    </div>
  )
}
