"use client";

import React, { useState } from "react";

const FilterSidebar: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 999999 });

  const handleCategoryChange = (category: string) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand: string) => {
    setBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="w-72 p-4 bg-white shadow-lg rounded-lg">
      {/* Filtro e Ordenar */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <select className="border rounded-md px-4 py-2">
            <option value="recent">Mais Recentes</option>
            <option value="priceLow">Preço: Menor para Maior</option>
            <option value="priceHigh">Preço: Maior para Menor</option>
          </select>
        </div>
      </div>

      <hr />

      {/* Categorias */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Categorias</h3>
        <ul className="mt-2 space-y-2">
          {["Jogos", "Consoles", "Computadores", "Acessórios"].map(
            (category) => (
              <li key={category} className="flex items-center">
                <input
                  type="checkbox"
                  id={category}
                  className="mr-2"
                  checked={categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                <label htmlFor={category} className="cursor-pointer">
                  {category}
                </label>
              </li>
            )
          )}
        </ul>
        <button className="text-violet-600 mt-2 text-sm">Ver Todas</button>
      </div>

      <hr className="my-4" />

      {/* Marcas */}
      <div>
        <h3 className="text-lg font-semibold">Marcas</h3>
        <ul className="mt-2 space-y-2">
          {[
            "Nintendo",
            "Sony",
            "Microsoft",
            "Activision Blizzard",
            "Tencent",
          ].map((brand) => (
            <li key={brand} className="flex items-center">
              <input
                type="checkbox"
                id={brand}
                className="mr-2"
                checked={brands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
              />
              <label htmlFor={brand} className="cursor-pointer">
                {brand}
              </label>
            </li>
          ))}
        </ul>
        <button className="text-violet-600 mt-2 text-sm">Ver Todas</button>
      </div>

      <hr className="my-4" />

      {/* Faixa de Preço */}
      <div>
        <h3 className="text-lg font-semibold">Faixa de Preço</h3>
        <div className="mt-4">
          <input
            type="range"
            className="w-full mb-2"
            min={0}
            max={999999}
            step={100}
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange({ ...priceRange, min: Number(e.target.value) })
            }
          />
          <input
            type="range"
            className="w-full"
            min={0}
            max={999999}
            step={100}
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange({ ...priceRange, max: Number(e.target.value) })
            }
          />
          <div className="flex justify-between mt-2">
            <input
              type="number"
              className="border rounded-md px-2 py-1 w-24"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({ ...priceRange, min: Number(e.target.value) })
              }
            />
            <input
              type="number"
              className="border rounded-md px-2 py-1 w-24"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: Number(e.target.value) })
              }
            />
          </div>
        </div>
      </div>

      {/* Botão Aplicar */}
      <button className="w-full bg-violet-600 text-white rounded-md py-2 mt-4">
        Aplicar
      </button>
    </div>
  );
};

export default FilterSidebar;
