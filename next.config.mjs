import withPlaiceholder from "@plaiceholder/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "res.cloudinary.com" },
    ],
  },
};

export default withPlaiceholder(nextConfig);
