import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/",
        destination: "/login"
      },
      {
        source: "/home",
        destination: "/home"
      },
      {
        source: "/homeManager",
        destination: "/homeManager"
      },
      {
        source: "/homeAdmin",
        destination: "/homeAdmin"
      },
      {
        source: "/courses",
        destination: "/courses"
      },
      {
        source: "/coursesManager",
        destination: "/coursesManager"
      },
      {
        source: "/coursesAdmin",
        destination: "/coursesAdmin"
      },
      {
        source: "/collaborators",
        destination: "/collaborators"
      },
      {
        source: "/calendar",
        destination: "/calendar"
      },
      {
        source: "/profile",
        destination: "/profile"
      },
      {
        source: "/profileManager",
        destination: "/profileManager"
      },
      {
        source: "/forgotPass",
        destination: "/forgotPass"
      },
      {
        source: "/addCourse",
        destination: "/addCourse"
      },
    ]
  }
};

export default nextConfig;
