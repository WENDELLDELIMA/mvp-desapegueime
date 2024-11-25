/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { Heart, ShoppingBag } from "lucide-react";
type Category = {
  id: string;
  category: string;
  image: string;
};
export default function Home() {
  const menu = [
    { id: 1, name: "Moda e Beleza" },
    { id: 2, name: "Games" },
    { id: 3, name: "Eletrodomésticos" },
    { id: 4, name: "Esporte e Lazer" },
    { id: 5, name: "Animais de Estimação" },
  ];
  const [categorias, setCategorias] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Obter dados da coleção "categorias" no Firestore

        const querySnapshot = await getDocs(collection(db, "categorias"));

        // Transformar os documentos em um array de objetos
        const categoriesWithImages = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Adicionar ID do documento
          ...(doc.data() as { category: string }), // Pega os campos do documento
        }));
        //@ts-expect-error
        setCategorias(categoriesWithImages);
      } catch (error) {
        console.error("Erro ao buscar categorias no Firebase:", error);
      }
    };

    fetchCategories();
  }, []);

  const [produtos, setProdutos] = useState([]);
  const [produtosCompras, setProdutosCompras] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar categorias

        const categoriasSnapshot = await getDocs(collection(db, "categorias"));
        const categoriasData = categoriasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // @ts-expect-error
        setCategorias(categoriasData);

        // Buscar produtos
        const q = query(collection(db, "produtos"), where("type", "==", ""));

        const produtosSnapshot = await getDocs(q);
        const produtosData = produtosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // @ts-expect-error
        setProdutos(produtosData);

        const qc = query(
          collection(db, "produtos"),
          where("type", "==", "Compra")
        );

        const produtosSnapshotc = await getDocs(qc);
        const produtosDatac = produtosSnapshotc.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProdutosCompras(produtosDatac);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);
  //@ts-expect-error
  const getProdutosPorCategoria = (category) => {
    //@ts-expect-error
    return produtos.filter((produto) => produto.category === category);
  };
  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center bg-foreground h-[106px] min-h[106px]">
        <div className="container flex items-center justify-between gap-20 p-2">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image src={"./logo-full.svg"} width={200} height={10} alt="eu" />
          </div>

          {/* Input */}
          <div className="flex-grow">
            <input
              type="text"
              id="basic-input"
              className="w-full rounded-md h-8 border-gray-300 shadow-sm sm:text-sm px-3"
              placeholder="Pesquisar"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-2 h-8">
            <button className="bg-white rounded-md p-2 w-[150px] shadow-md flex justify-center items-center">
              Entrar
            </button>
            <button className="bg-white rounded-md p-2 w-[150px] shadow-md flex justify-center items-center">
              Anunciar
            </button>
          </div>
        </div>
      </div>

      <div className="border-b-2">
        <nav className="flex mx-[15%] justify-center">
          <ul className="flex w-full justify-between items-center container h-[53px]">
            {menu.map((menu) => (
              <li
                key={menu.id}
                className="text-[#606060] cursor-pointer flex items-center justify-center h-full hover:border-b-2 hover:border-violet-600 transition-all"
              >
                {menu.name}
              </li>
            ))}
            <li className="text-[#606060] cursor-pointer flex items-center justify-center h-full hover:border-b-2 hover:border-violet-600 transition-all">
              Todas as Categorias
            </li>
          </ul>
        </nav>
      </div>

      <div className="w-full flex items-center justify-center">
        <div className="container justify-center flex">
          <Image
            src={"./banner-home.svg"}
            alt="eu"
            width={1300}
            height={300}
            className="w-[90%] h-auto"
          />
        </div>
      </div>
      <div className="flex flex-col m-auto w-[72%]">
        <h1 className="font-semibold pb-8">
          <span className="text-gray-500 text-lg">Compre nas </span>Principais
          Categorias
        </h1>
        <div className="flex gap-8 justify-center">
          {categorias.map((category) => (
            <div
              key={category.id}
              className="flex flex-col items-center p-2 gap-4 "
            >
              <Image
                src={category.image}
                alt={category.category}
                className="rounded-full h-[12rem] min-w-[12rem] hover:border-2 hover:border-foreground "
                width={100}
                height={100}
              />
              <h2>{category.category}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8 mt-12">
        {categorias.map((category) => (
          <div key={category.id} className="flex flex-col m-auto w-[72%]">
            {/* Nome da Categoria */}
            <div className="flex items-top justify-between">
              <h1 className="font-semibold pb-8 text-lg text-gray-500">
                {category.category}
              </h1>
              <span className="items-center flex h-full">
                ver todos <span className="text-xl"> {" >"} </span>
              </span>
            </div>

            {/* Produtos da Categoria */}
            <div className="flex gap-8 justify-start">
              {getProdutosPorCategoria(category.category).map(
                (produto: any) => (
                  <div
                    key={produto.id}
                    className="flex flex-col items-center  border rounded-lg shadow-md w-[15rem]"
                  >
                    <div className="relative w-full h-[12rem]">
                      {/* Imagem */}
                      <Image
                        src={produto.image}
                        alt={produto.description}
                        className="h-full w-full object-cover rounded-md"
                        width={100}
                        height={100}
                      />

                      {/* Span no canto superior direito */}
                      {produto.oldPrice > produto.currentPrice && (
                        <span className="absolute top-0 right-0 text-white p-1 text-xs font-bold rounded bg-violet-400">
                          {`${(
                            ((produto.currentPrice - produto.oldPrice) /
                              produto.currentPrice) *
                            100
                          ).toFixed(2)}%`}
                        </span>
                      )}

                      {produto.oldPrice < produto.currentPrice && (
                        <span className="absolute top-0 right-0 text-white p-1 text-xs font-bold rounded bg-red-400">
                          {`${(
                            ((produto.currentPrice - produto.oldPrice) /
                              produto.currentPrice) *
                            100
                          ).toFixed(2)}%`}
                        </span>
                      )}
                    </div>

                    <h2 className="font-semibold text-sm text-black w-full p-2">
                      {produto.description}
                    </h2>
                    <div className="flex w-full justify-around items-baseline">
                      <span className="text-foreground font-bold">
                        R$ {produto.currentPrice.toFixed(2)}
                      </span>

                      <span className="text-gray-400 line-through text-sm">
                        R$ {produto.oldPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t-[1px] w-full flex items-center justify-around py-2 px-2 gap-4">
                      {/* Botão Compre Agora */}
                      <button className="bg-violet-500 text-white px-2 py-1 text-[0.7rem] rounded shadow-md hover:bg-violet-700">
                        Compre agora
                      </button>

                      {/* Ícones */}
                      <div className="flex items-center gap-4">
                        {/* Carrinho */}
                        <ShoppingBag
                          size={18}
                          className="cursor-pointer hover:text-violet-700"
                        />
                        {/* Favoritar */}
                        <Heart
                          size={18}
                          className="cursor-pointer hover:text-violet-500"
                        />
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-8 mt-12">
        <div className="flex flex-col m-auto w-[72%]">
          {/* Nome da Categoria */}
          <div className="flex items-top justify-between">
            <h1 className="font-semibold pb-8 text-lg text-gray-500">
              Pessoas estão querendo comprar
            </h1>
            <span className="items-center flex h-full">
              ver todos <span className="text-xl"> {" >"} </span>
            </span>
          </div>
          <div className="flex gap-8 justify-start">
            {produtosCompras.map((produto) => (
              <div
                key={produto.id}
                className="flex flex-col items-center  border rounded-lg shadow-md w-[15rem]"
              >
                <div className="relative w-full h-[12rem]">
                  {/* Imagem */}
                  <Image
                    src={produto.image}
                    alt={produto.description}
                    className="h-full w-full object-cover rounded-md"
                    width={100}
                    height={100}
                  />

                  {/* Span no canto superior direito */}
                  {produto.oldPrice > produto.currentPrice && (
                    <span className="absolute top-0 right-0 text-white p-1 text-xs font-bold rounded bg-violet-400">
                      {`${(
                        ((produto.currentPrice - produto.oldPrice) /
                          produto.currentPrice) *
                        100
                      ).toFixed(2)}%`}
                    </span>
                  )}

                  {produto.oldPrice < produto.currentPrice && (
                    <span className="absolute top-0 right-0 text-white p-1 text-xs font-bold rounded bg-red-400">
                      {`${(
                        ((produto.currentPrice - produto.oldPrice) /
                          produto.currentPrice) *
                        100
                      ).toFixed(2)}%`}
                    </span>
                  )}
                </div>

                <h2 className="font-semibold text-sm text-black w-full p-2">
                  {produto.description}
                </h2>
                <div className="flex w-full justify-around items-baseline">
                  <span className="text-black font-regular">
                    R$ {produto.currentPrice.toFixed(2)}
                  </span>

                  <span className="text-gray-400 line-through text-sm">
                    R$ {produto.oldPrice.toFixed(2)}
                  </span>
                </div>
                <div className="border-t-[1px] w-full flex items-center justify-around py-2 px-2 gap-4">
                  {/* Botão Compre Agora */}
                  <button className="bg-red-500 text-white px-2 py-1 text-[0.7rem] rounded shadow-md hover:bg-violet-700">
                    Fazer Desapego
                  </button>

                  {/* Ícones */}
                  <div className="flex items-center gap-4">
                    {/* Carrinho */}
                    <ShoppingBag
                      size={18}
                      className="cursor-pointer hover:text-red-700"
                    />
                    {/* Favoritar */}
                    <Heart
                      size={18}
                      className="cursor-pointer hover:text-red-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Produtos da Categoria */}
          <div className="flex gap-8 justify-start"></div>
        </div>
      </div>

      <div className="w-full flex items-center justify-center mt-20">
        <div className="container justify-center flex">
          <Image
            src={"./banner-procurando.svg"}
            alt="eu"
            width={1300}
            height={300}
            className="w-[90%] h-auto"
          />
        </div>
      </div>
      <footer className="bg-violet-500 text-white py-6 mt-10">
        <div className="container mx-auto px-4">
          {/* Links principais */}
          <div className="flex justify-between border-b border-white/20 pb-6 mb-6">
            <div className="space-y-2">
              <h3 className="font-bold uppercase">Categorias Principais</h3>
              <ul className="space-y-1 text-sm">
                <li>Central de Ajuda</li>
                <li>Segurança e Privacidade</li>
                <li>Como Publicar um Anúncio</li>
                <li>Dicas para um Bom Anúncio</li>
                <li>Segurança da Conta</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold uppercase">Pesquisa Populares</h3>
              <ul className="space-y-1 text-sm">
                <li>Exclusão de Conta</li>
                <li>Reativação de Conta</li>
                <li>Vender na DESAPEGUEIME</li>
                <li>Dicas de Segurança</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold uppercase">Links Úteis</h3>
              <ul className="space-y-1 text-sm">
                <li>Ajuda</li>
                <li>Termos de Uso</li>
                <li>Política de Privacidade</li>
              </ul>
            </div>
          </div>

          {/* Direitos reservados e redes sociais */}
          <div className="flex justify-between items-center">
            <span className="text-xs">&copy; Desapegueime.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-300">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="hover:text-gray-300">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="hover:text-gray-300">
                <i className="fab fa-tiktok"></i>
              </a>
              <a href="#" className="hover:text-gray-300">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-gray-300">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
