import React from "react";
import { Link } from "react-router-dom";
import ShaderBackground from "../components/ShaderBackground";

const Home: React.FC = () => {
  return (
    <ShaderBackground>
      {/* Top Right Navigation */}
      <div className="absolute top-8 right-8 z-20 flex items-center gap-4">
        <Link
          to="/login"
          className="px-6 py-2 text-white/90 font-medium text-sm transition-all duration-200 hover:text-white"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium text-sm transition-all duration-200 hover:bg-white/20 hover:border-white/30"
        >
          Register
        </Link>
      </div>

      <main className="absolute bottom-8 left-8 z-20 max-w-lg">
        <div className="text-left">
          <div
            className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm mb-4 relative"
            style={{
              filter: "url(#glass-effect)",
            }}
          >
            <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
            <span className="text-white/90 text-xs font-light relative z-10">
              ✨ New Writing Experience
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl md:leading-16 tracking-tight font-light text-white mb-4">
            <span className="font-medium italic instrument">Express</span>{" "}
            Yourself
            <br />
            <span className="font-light tracking-tight text-white">
              Through Words
            </span>
          </h1>

          {/* Description */}
          <p className="text-xs font-light text-white/70 mb-4 leading-relaxed">
            Craft beautiful text with Textie's intuitive editor. Organize your
            thoughts, create stunning documents, and bring your ideas to life
            with powerful writing tools and seamless workspace management.
          </p>

          {/* CTA Button */}
          <div className="flex items-center">
            <Link
              to="/register"
              className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium text-sm transition-all duration-200 hover:bg-white/20 hover:border-white/30"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>
      {/* </div> */}
    </ShaderBackground>
  );
};

export default Home;
