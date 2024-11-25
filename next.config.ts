/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config:any) {
    // Filtra regras que possuem 'test' e verificam SVG
    config.module.rules = config.module.rules.filter(
      (rule:any) => !(rule.test && rule.test.test && rule.test.test(".svg"))
    );

    // Adiciona nova regra para usar @svgr/webpack para SVGs
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Permite qualquer domínio
      },
    ],
  },
};

module.exports = nextConfig;
