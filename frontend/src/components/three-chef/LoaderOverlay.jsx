// LoaderOverlay.jsx
import React from "react";
import { Html, useProgress } from "@react-three/drei";

export default function LoaderOverlay() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{
        width: 220,
        padding: 18,
        background: "rgba(255,255,255,0.95)",
        borderRadius: 12,
        boxShadow: "0 6px 30px rgba(0,0,0,0.12)",
        textAlign: "center",
        color: "#111"
      }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Loading chef...</div>
        <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>{Math.round(progress)}%</div>
      </div>
    </Html>
  );
}
