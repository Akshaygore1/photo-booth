import { MeshGradient } from "@paper-design/shaders-react";

export default function FormSideFrame() {
  return (
    <MeshGradient
      className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
      colors={["#000000", "#f02d65", "#bf0d51"]}
      speed={0.3}
      swirl={0.3}
    >
      <div className="text-center text-white px-8">
        <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
        <p className="text-xl opacity-90 mb-8">
          Sign in to access your photo booth dashboard
        </p>
      </div>
    </MeshGradient>
  );
}
