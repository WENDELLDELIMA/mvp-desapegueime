/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Filtra regras que possuem 'test' e verificam SVG
    config.module.rules = config.module.rules.filter(
      (rule) => !(rule.test && rule.test.test && rule.test.test(".svg"))
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
  eslint: {
    // Ignora os erros do ESLint durante o build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora os erros de tipagem durante o build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
