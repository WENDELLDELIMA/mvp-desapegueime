import React, { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "../../../../firebase"; // Configuração do Firestore
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
const CategorySelector = ({ userEmail }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [confirmedCondition, setConfirmedCondition] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [userName, setUserName] = useState("");
  const route = useRouter();
  const [productDetails, setProductDetails] = useState({
    name: "",
    price: "",
    stock: "",
    code: "",
    sku: "",
  });

  const categories = [
    { name: "Moda e Beleza", image: "makeup.svg" },
    { name: "Games", image: "games.svg" },
    { name: "Eletrodomésticos", image: "home.svg" },
    { name: "Informática", image: "computer.svg" },
    { name: "Esporte e Lazer", image: "education.svg" },
    { name: "Animais de Estimação", image: "pet.svg" },
  ];

  useEffect(() => {
    // Obtém o nome do usuário do localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserName(storedUser);
    }
  }, []);

  const subcategories = {
    "Moda e Beleza": [
      "Roupas",
      "Acessórios",
      "Calçados",
      "Maquiagem",
      "Perfumes",
      "Joias",
      "Cabelos e Perucas",
      "Relógios",
      "Produtos para Unhas",
      "Outros",
    ],
    Games: [
      "Acessórios para Consoles",
      "Consoles",
      "Jogos Digitais",
      "Jogos Físicos",
      "PC Gaming",
      "Arcades",
      "Peças de Consoles",
      "Controles",
      "Headsets",
      "Outros",
    ],
    Eletrodomésticos: [
      "Geladeiras",
      "Fogões",
      "Máquinas de Lavar",
      "Micro-ondas",
      "Freezers",
      "Aspiradores de Pó",
      "Ventiladores",
      "Ar-condicionado",
      "Purificadores de Água",
      "Outros",
    ],
    Informática: [
      "Notebooks",
      "PCs e Acessórios",
      "Monitores",
      "Teclados",
      "Mouses",
      "Impressoras",
      "Softwares",
      "Cabos e Adaptadores",
      "Componentes Internos",
      "Outros",
    ],
    "Esporte e Lazer": [
      "Equipamentos Esportivos",
      "Bicicletas",
      "Acessórios para Bicicletas",
      "Roupas Esportivas",
      "Tênis",
      "Produtos para Camping",
      "Pesca e Caça",
      "Equipamentos para Academia",
      "Bolas e Redes",
      "Outros",
    ],
    "Animais de Estimação": [
      "Rações e Alimentos",
      "Camas e Casas",
      "Brinquedos para Pets",
      "Produtos de Higiene",
      "Coleiras e Guias",
      "Roupas para Pets",
      "Gaiolas e Terrários",
      "Aquários e Acessórios",
      "Produtos de Adestramento",
      "Outros",
    ],
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImages((prevImages) => [...prevImages, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedDetails = Object.fromEntries(formData.entries());

    setProductDetails((prevDetails) => ({
      ...prevDetails,
      ...updatedDetails,
    }));

    handleProductSubmit(updatedDetails, userName);
  };

  const handleProductSubmit = async (updatedDetails, userName) => {
    try {
      // Referência da categoria no Firestore
      const categoryRef = doc(db, "categorias", selectedCategory.name);
      const categorySnap = await getDoc(categoryRef);

      if (!categorySnap.exists()) {
        // Se a categoria não existir, criar com os dados padrão
        const newCategoryData = {
          category: selectedCategory.name,
          image: uploadedImages[0],
          price: Date.now(), // Incremental ID baseado no timestamp atual
          title: selectedCategory.name,
        };

        await setDoc(categoryRef, newCategoryData);
      }

      // Preparar os dados do produto
      const productData = {
        category: selectedCategory.name,
        subcategory: selectedSubcategory,
        condition: selectedCondition,
        ...updatedDetails,
        images: uploadedImages,
        user: userName, // Certifique-se de que userName está corretamente configurado no localStorage
        createdAt: new Date(),
        type: null,
      };

      // Criar o produto na coleção 'products'
      const productRef = doc(db, "products", `${Date.now()}`);
      await setDoc(productRef, productData);

      alert("Produto adicionado com sucesso!");

      route.push("meus-anuncios");

      // Reset do fluxo
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSelectedCondition(null);
      setConfirmedCondition(false);
      setUploadedImages([]);
      setProductDetails({
        name: "",
        price: "",
        stock: "",
        code: "",
        sku: "",
      });
    } catch (error) {
      console.error("Erro ao salvar o produto:", error);
      alert("Erro ao salvar o produto. Tente novamente.");
    }
  };

  const ProductDetailsForm = ({ category, subcategory }) => (
    <div className="flex flex-col items-center justify-center h-screen px-2 -mt-20">
      <h1 className="text-3xl mb-10 text-center">
        Hora de dar mais detalhes! Você está anunciando em{" "}
        <span className="font-semibold">{category.name}</span> &gt;{" "}
        <span className="font-semibold">{subcategory}</span>.
      </h1>

      <div className="w-full max-w-3xl bg-white rounded shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          Fotos e Detalhes Adicionais
        </h2>

        <div className="mb-6">
          <p className="text-sm font-semibold mb-2">Fotos (obrigatório)</p>
          <div className="flex gap-4 flex-wrap">
            <label
              htmlFor="image-upload"
              className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-violet-500 rounded-lg cursor-pointer"
            >
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <span className="text-violet-500">Selecionar</span>
            </label>
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative w-32 h-32">
                <img
                  src={image}
                  alt={`Uploaded ${index}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Nome do Produto
              </label>
              <input
                type="text"
                name="name"
                placeholder="Digite o nome do produto"
                defaultValue={productDetails.name}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Preço</label>
              <input
                type="text"
                name="price"
                placeholder="R$ 50,00"
                defaultValue={productDetails.price}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Estoque
              </label>
              <input
                type="text"
                name="stock"
                placeholder="Quantidade"
                defaultValue={productDetails.stock}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Código Universal
              </label>
              <input
                type="text"
                name="code"
                placeholder="EAN, UPC ou GTIN"
                defaultValue={productDetails.code}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">SKU</label>
              <input
                type="text"
                name="sku"
                placeholder="SKU do produto"
                defaultValue={productDetails.sku}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-violet-500 text-white py-2 rounded shadow hover:bg-violet-600"
          >
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );

  if (confirmedCondition) {
    return (
      <ProductDetailsForm
        category={selectedCategory}
        subcategory={selectedSubcategory}
      />
    );
  }

  if (selectedSubcategory) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <h1 className="text-3xl mb-8 text-center">Selecione a Condição</h1>
        <div className="w-full max-w-3xl bg-white rounded shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">
            Informe a condição em que seu produto se encontra
          </h2>
          <ul className="space-y-4">
            {["Novo", "Usado", "Recondicionado"].map((condition) => (
              <li key={condition}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    value={condition}
                    checked={selectedCondition === condition}
                    onChange={() => setSelectedCondition(condition)}
                    className="form-radio text-violet-500"
                  />
                  <span className="text-sm">{condition}</span>
                </label>
              </li>
            ))}
          </ul>
          <button
            className="mt-6 w-full bg-violet-500 text-white py-2 rounded shadow hover:bg-violet-600"
            onClick={() => setConfirmedCondition(true)}
            disabled={!selectedCondition}
          >
            Confirmar
          </button>
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-2 -mt-20">
        <h1 className="text-3xl mb-10 text-center">
          Na categoria{" "}
          <span className="font-semibold">{selectedCategory.name}</span>, temos
          diversas opções. Você está anunciando:
        </h1>
        <div className="flex w-full items-center justify-center gap-20">
          <Image
            src={selectedCategory.image}
            width={150}
            height={150}
            alt={selectedCategory.name}
            className="mb-6"
          />
          <div className="w-full max-w-[60%] bg-white rounded shadow-md">
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold px-4 py-3 border-b">
                Qual opção o descreve?
              </h2>
              <ul className="divide-y divide-gray-200">
                {subcategories[selectedCategory.name]?.map((option, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedSubcategory(option)}
                  >
                    <span>{option}</span>
                    <span className="text-gray-400">›</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mt-8 px-4 py-2 bg-violet-500 text-white rounded shadow w-full"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col relative">
      <div className="flex-grow bg-[#ECE8FE]"></div>
      <div className="absolute -mt-20 inset-0 flex flex-col justify-center items-center">
        <h1 className="text-2xl text-center mb-10 text-black">
          Vamos começar a criar seu anúncio. Primeiro, me conte, qual categoria
          melhor descreve o que você gostaria anunciar hoje?
        </h1>
        <div className="flex justify-center gap-4 flex-wrap text-black">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => setSelectedCategory(category)}
              className="cursor-pointer p-4 bg-white shadow rounded items-center justify-center flex flex-col w-40 hover:shadow-lg transition"
            >
              <Image
                src={category.image}
                width={100}
                height={100}
                alt={category.name}
              />
              {category.name}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-grow bg-white"></div>
    </div>
  );
};

export default CategorySelector;
