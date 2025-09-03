import { MeshGradient } from "@paper-design/shaders-react";

interface ShaderBackgroundProps {
  children: React.ReactNode;
}

export default function ShaderBackground({ children }: ShaderBackgroundProps) {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={["#000000", "#f02d65", "#bf0d51"]}
        speed={0.3}
        swirl={0.3}
      />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-60"
        colors={["#f02d65", "#f02d65", "#000000"]}
        speed={0.2}
        swirl={0.3}
      />

      {children}
    </div>
  );
}
