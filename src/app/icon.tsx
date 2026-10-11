import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: "linear-gradient(135deg, #7C3AED, #4C1D95)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FDE68A",
          fontSize: 20,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        $
      </div>
    ),
    { ...size }
  );
}
