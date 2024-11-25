"use client";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; // Certifique-se do caminho correto
import Image from "next/image";
type Category = {
  id: string;
  category: string;
};
export default function AddProduct() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [type, setType] = useState(""); // Estado para o tipo de produto
  const [uploading, setUploading] = useState(false);

  // Buscar categorias do Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categorias"));
        const categoriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesData as []);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategories();
  }, []);

  // Converter imagem para Base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string); // Salvar imagem em Base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!category) {
      alert("Por favor, selecione uma categoria.");
      return;
    }

    if (!type) {
      alert("Por favor, selecione o tipo (Compra ou Venda).");
      return;
    }

    if (!imageBase64) {
      alert("Por favor, selecione uma imagem.");
      return;
    }

    setUploading(true);
    try {
      // Adicionar os dados ao Firestore
      await addDoc(collection(db, "produtos"), {
        category,
        type, // Adiciona o tipo ao documento
        currentPrice: parseFloat(currentPrice),
        oldPrice: parseFloat(oldPrice),
        description,
        image: imageBase64, // Salvar a imagem em Base64
      });

      alert("Produto adicionado com sucesso!");
      setCategory("");
      setCurrentPrice("");
      setOldPrice("");
      setDescription("");
      setImageBase64("");
      setType(""); // Resetar o tipo
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      alert("Erro ao adicionar produto.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Adicionar Produto</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        {/* Categoria */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-4 py-2"
          required
        >
          <option value="" disabled>
            Selecione uma categoria
          </option>
          {categories.map((cat) => (
            <option key={cat.category} value={cat.category}>
              {cat.category}
            </option>
          ))}
        </select>

        {/* Tipo */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded px-4 py-2"
          required
        >
          <option value="" disabled>
            Selecione o tipo
          </option>
          <option value="Compra">Compra</option>
          <option value="Venda">Venda</option>
        </select>

        {/* Preço Atual */}
        <input
          type="number"
          placeholder="Preço Atual"
          value={currentPrice}
          onChange={(e) => setCurrentPrice(e.target.value)}
          className="border rounded px-4 py-2"
          required
        />

        {/* Preço Antigo */}
        <input
          type="number"
          placeholder="Preço Antigo"
          value={oldPrice}
          onChange={(e) => setOldPrice(e.target.value)}
          className="border rounded px-4 py-2"
        />

        {/* Descrição */}
        <textarea
          placeholder="Descrição do Produto"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded px-4 py-2"
          required
        />

        {/* Imagem */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border rounded px-4 py-2"
          required
        />
        {imageBase64 && (
          <Image
            src={imageBase64}
            alt="Pré-visualização"
            className="object-cover mt-4 rounded-md"
            width={152}
            height={152}
          />
        )}

        {/* Botão */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={uploading}
        >
          {uploading ? "Adicionando Produto..." : "Adicionar Produto"}
        </button>
      </form>
    </div>
  );
}
