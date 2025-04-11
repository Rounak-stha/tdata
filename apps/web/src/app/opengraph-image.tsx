import { ImageResponse } from "next/og";
import { Logo } from "@/components/icons/logo";

// Image metadata
export const size = {
  width: 1200,
  height: 630,
};

export const alt = "Tdata - Project Management Solution";
export const contentType = "image/png";

// Define colors for icons
const iconColors = {
  check: "#FF4545",
  clock: "#FFB800",
  sliders: "#8B5CF6",
  chart: "#EC4899",
  calendar: "#22C55E",
  message: "#06B6D4",
  users: "#A855F7",
  file: "#3B82F6",
};

const GridBackground = () => {
  const spacing = 80;
  const width = 1200;
  const height = 630;
  const lines = [];

  // Horizontal lines
  for (let y = 0; y <= height; y += spacing) {
    lines.push(<line key={`h-${y}`} x1="0" y1={y} x2={width} y2={y} stroke="#ffffff" strokeWidth="1" opacity="0.02" />);
  }

  // Vertical lines
  for (let x = 0; x <= width; x += spacing) {
    lines.push(<line key={`v-${x}`} x1={x} y1="0" x2={x} y2={height} stroke="#fff" strokeWidth="1" opacity="0.02" />);
  }

  // Diagonal lines: ↘
  for (let i = -width; i < width + height; i += spacing) {
    lines.push(<line key={`d1-${i}`} x1={i} y1="0" x2={i + height} y2={height} stroke="#fff" strokeWidth="1" opacity="0.02" />);
  }

  // Diagonal lines: ↗
  for (let i = -width; i < width + height; i += spacing) {
    lines.push(<line key={`d2-${i}`} x1={i} y1={height} x2={i + height} y2="0" stroke="#fff" strokeWidth="1" opacity="0.02" />);
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    >
      {lines}
    </svg>
  );
};

// Image generation
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0c 0%, #121218 100%)",
          fontFamily: "Nunito, sans-serif",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Abstract grid pattern */}
        <GridBackground />
        {/* Icons positioned around */}
        <div style={{ position: "absolute", top: "20%", left: "10%", display: "flex", transform: "rotate(-12deg)", filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.7))" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <rect width="18" height="18" x="3" y="3" rx="2" stroke={iconColors.check} strokeWidth="2" />
            <path d="m9 12 2 2 4-4" stroke={iconColors.check} strokeWidth="2" />
          </svg>
        </div>

        <div style={{ position: "absolute", top: "30%", left: "80%", display: "flex", transform: "rotate(-8deg)", filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.7))" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke={iconColors.clock} strokeWidth="2" />
            <path d="M12 6v6l4 2" stroke={iconColors.clock} strokeWidth="2" />
          </svg>
        </div>

        <div style={{ position: "absolute", top: "65%", left: "80%", display: "flex", transform: "rotate(-8deg)", filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.7))" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M3 3v18h18" stroke={iconColors.chart} strokeWidth="2" />
            <path d="M18 9v12" stroke={iconColors.chart} strokeWidth="2" />
            <path d="M13 12v9" stroke={iconColors.chart} strokeWidth="2" />
            <path d="M8 17v4" stroke={iconColors.chart} strokeWidth="2" />
          </svg>
        </div>

        <div style={{ position: "absolute", top: "70%", left: "20%", display: "flex", transform: "rotate(15deg)", filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.7))" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <rect width="18" height="18" x="3" y="4" rx="2" stroke={iconColors.calendar} strokeWidth="2" />
            <path d="M16 2v4" stroke={iconColors.calendar} strokeWidth="2" />
            <path d="M8 2v4" stroke={iconColors.calendar} strokeWidth="2" />
            <path d="M3 10h18" stroke={iconColors.calendar} strokeWidth="2" />
          </svg>
        </div>

        <div style={{ position: "absolute", top: "35%", left: "30%", display: "flex", transform: "rotate(-5deg)", filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.7))" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={iconColors.message} strokeWidth="2" />
          </svg>
        </div>

        <div style={{ position: "absolute", top: "20%", left: "65%", display: "flex", transform: "rotate(8deg)", filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.7))" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke={iconColors.users} strokeWidth="2" />
            <circle cx="9" cy="7" r="4" stroke={iconColors.users} strokeWidth="2" />
            <path d="M22 21v-2a4 4 0 00-3-3.87" stroke={iconColors.users} strokeWidth="2" />
            <path d="M16 3.13a4 4 0 010 7.75" stroke={iconColors.users} strokeWidth="2" />
          </svg>
        </div>

        <div style={{ position: "absolute", top: "80%", left: "60%", display: "flex", transform: "rotate(-10deg)", filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.7))" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke={iconColors.file} strokeWidth="2" />
            <path d="M14 2v6h6" stroke={iconColors.file} strokeWidth="2" />
            <path d="M16 13H8" stroke={iconColors.file} strokeWidth="2" />
            <path d="M16 17H8" stroke={iconColors.file} strokeWidth="2" />
            <path d="M10 9H8" stroke={iconColors.file} strokeWidth="2" />
          </svg>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <Logo size={160} />
          <div style={{ display: "flex" }}>
            <h1
              style={{
                fontSize: "80px",
                fontWeight: "bold",
                color: "white",
                margin: "0",
              }}
            >
              Tdata
            </h1>
          </div>
          <div style={{ display: "flex" }}>
            <p
              style={{
                fontSize: "28px",
                color: "white",
                margin: "0",
                opacity: "0.9",
              }}
            >
              Project management for modern teams
            </p>
          </div>
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
}
