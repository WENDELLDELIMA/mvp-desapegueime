"use client";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase"; // Certifique-se do caminho correto para o arquivo firebase.js

export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "categorias"), {
        title,
        category,
        price: parseFloat(price),
        image,
      });
      alert("Produto adicionado com sucesso!");
      setTitle("");
      setCategory("");
      setPrice("");
      setImage("");
    } catch (error) {
      console.error("Erro ao adicionar produto: ", error);
      alert("Erro ao adicionar produto.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Adicionar Produto</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          placeholder="Título do Produto"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded px-4 py-2"
        />
        <input
          type="text"
          placeholder="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-4 py-2"
        />
        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border rounded px-4 py-2"
        />
        <input
          type="text"
          placeholder="URL da Imagem"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="border rounded px-4 py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Adicionar Produto
        </button>
      </form>
    </div>
  );
}
