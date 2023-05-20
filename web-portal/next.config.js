/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// images: {
	// 	remotePatterns: [
	// 		{
	// 			protocol: "https",
	// 			hostname: "raw.githubusercontent.com",
	// 			port: "",
	// 			pathname: "/Wellnation/**",
	// 		},
	// 		{
	// 			protocol: "https",
  //       hostname: "avatars.githubusercontent.com",
  //       port: "",
  //       pathname: "/u/**",
	// 		},
	// 	],
	// },
  images: {
    domains: ['raw.githubusercontent.com', 'avatars.githubusercontent.com'],
  }
};

module.exports = nextConfig
