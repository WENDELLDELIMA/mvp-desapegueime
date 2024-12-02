import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // Importa a fonte do Google
import "./globals.css";
import { AuthProvider } from "@/context/authContext";

// Configura a fonte Poppins
const poppins = Poppins({
  subsets: ["latin"], // Subconjunto necessário para o suporte completo ao idioma
  variable: "--font-poppins", // Define uma variável CSS para a fonte
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Intervalo de pesos
});

export const metadata: Metadata = {
  title: "Desapeguei-me",
  description: "Compra e venda de Usados, Leilões",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        {" "}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
