import React from "react";

export default function EvidenceWatermark({
  requestId,
  userId,
  children,
  visible = true,
}: {
  requestId: string;
  userId: string;
  children: React.ReactNode;
  visible?: boolean;
}) {
  if (!visible) return <>{children}</>;
  const text = `Stratus • RFQ ${requestId} • User ${userId}`;
  return (
    <div className="relative">
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 40px)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-25"
        style={{ transform: "rotate(-18deg)" }}
      >
        <span className="text-white text-3xl font-semibold tracking-wide">{text}</span>
      </div>
    </div>
  );
}
