'use client'

import { createContext, useContext, useState } from "react";

type ProductType = {
  id: string;
  image: string;
  price: number;
  oldPrice?: number;
  description: string;
  category: string;
  type: string;
};

type ProductContextType = {
  product: ProductType | null;
  setProduct: (product: ProductType | null) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
