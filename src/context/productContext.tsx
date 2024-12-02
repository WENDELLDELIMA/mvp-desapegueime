"use client";

import { createContext, useContext, useState } from "react";

type ProductType = {
  id: string;
  category: string; // Categoria do produto
  code: string; // Código do produto (usando o ID como referência)
  condition: string; // Condição do produto, por exemplo, "Novo", "Usado"
  createdAt: string; // Data de criação no formato timestamp
  images: string[]; // Array de URLs ou base64 das imagens
  name: string; // Nome do produto
  price: string; // Preço do produto em formato string
  sku: string; // SKU do produto
  stock: string; // Quantidade em estoque
  subcategory: string; // Subcategoria do produto
  type: string | null; // Tipo adicional do produto ou null
  user: string; // Usuário associado ao produto
};

type ProductContextType = {
  product: ProductType | null;
  setProduct: (product: ProductType | null) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [product, setProduct] = useState<ProductType | null>(null);

  return (
    <ProductContext.Provider value={{ product, setProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};
