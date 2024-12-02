/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { ShoppingBag } from "lucide-react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import loadingAnimation from "../../../public/animations/animation.json";
import Link from "next/link";

// type Category = {
//   id: string;
//   category: string;
//   image: string;
// };
export default function Home() {
  const menu = [
    { id: 1, name: "Moda e Beleza" },
    { id: 2, name: "Games" },
    { id: 3, name: "Eletrodomésticos" },
    { id: 4, name: "Esporte e Lazer" },
    { id: 5, name: "Animais de Estimação" },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
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

  // const [produtos, setProdutos] = useState([]);

  const handleSubmit = () => {
    alert(10);
  };

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
      setTimeout(() => {
        setLoading(false);
      }, 2700);
    };

    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <div className="h-screen bg-foreground flex text-white items-center justify-center">
          <Lottie
            animationData={loadingAnimation}
            style={{ height: 300, width: 300 }}
          />
        </div>
      ) : (
        <div className="w-full">
          <div className="flex flex-col items-center justify-center bg-foreground h-[106px] min-h-[106px]">
            <div className="container flex items-center justify-around sm:justify-between gap-4 sm:gap-20 p-2">
              {/* Logo */}
              <div className="flex-shrink-0 hidden sm:flex">
                <Link href={"/"}>
                  <Image
                    src={"./logo-full.svg"}
                    width={200}
                    height={10}
                    alt="eu"
                  />
                </Link>
              </div>
              <div className="flex-shrink-0 sm:hidden flex">
                <Link href={"/"}>
                  <Image src={"./logo.svg"} width={45} height={45} alt="eu" />
                </Link>
              </div>

              {/* Input */}
              <div className="w-full sm:w-auto sm:flex-grow">
                <input
                  type="text"
                  id="basic-input"
                  className="w-full rounded-md h-10 sm:h-8 border-gray-300 shadow-sm sm:text-sm px-3"
                  placeholder="Pesquisar"
                />
              </div>

              {/* Botões */}
              <div className="sm:flex hidden gap-2 h-8">
                <button className="bg-white rounded-md p-2 w-[150px] shadow-md flex justify-center items-center">
                  Entrar
                </button>
                <button className="bg-white rounded-md p-2 w-[150px] shadow-md flex justify-center items-center">
                  Anunciar
                </button>
              </div>
              <div>
                <button className="bg-white sm:hidden rounded-md p-2 shadow-md flex justify-center items-center">
                  <ShoppingBag />
                </button>
              </div>
            </div>
          </div>

          <div className="border-b-2">
            {/* Menu Web */}
            <nav className=" hidden sm:flex mx-[15%] justify-center">
              <ul className="flex w-full justify-between items-center container h-[53px]">
                {menu.map((menu) => (
                  <li
                    key={menu.id}
                    className="text-[#606060] cursor-pointer flex items-center justify-center h-full hover:border-b-2 hover:border-violet-600 transition-all"
                  >
                    {menu.name}
                  </li>
                ))}
              </ul>
            </nav>
            {/* Menu Mobile */}
            <nav className="sm:hidden flex container mx-auto">
              {/* Menu container */}
              <ul className="flex flex-col md:flex-row md:justify-between w-full items-center">
                {/* "Todas as Categorias" always visible */}
                <li
                  className="text-[#606060] cursor-pointer flex items-center justify-center h-12 md:h-full w-full md:w-auto hover:border-b-2 hover:border-violet-600 transition-all"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  Todas as Categorias
                  <span className="ml-2">{menuOpen ? "▲" : "▼"}</span>
                </li>

                {/* Other categories */}
                <div
                  className={`${
                    menuOpen ? "flex" : "hidden"
                  } flex-col md:flex md:flex-row w-full md:w-auto`}
                >
                  {menu.map((menu) => (
                    <li
                      key={menu.id}
                      className="text-[#606060] cursor-pointer flex items-center justify-center h-12 md:h-full w-full md:w-auto hover:border-b-2 hover:border-violet-600 transition-all"
                    >
                      {menu.name}
                    </li>
                  ))}
                </div>
              </ul>
            </nav>
          </div>

          <div className="w-full flex items-center justify-center mt-10 h-full">
            <div className="container w-[50%] p-10 justify-center flex border-2 border-foreground rounded-lg">
              <div className="flex flex-col w-full justify-center items-center gap-4">
                <h1>Faça Login no Desapeguei.me</h1>

                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-8 w-[70%] "
                >
                  <input
                    type="text"
                    placeholder="Nome Completo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded px-4 py-2"
                  />
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded px-4 py-2"
                  />
                  <input
                    type="password"
                    placeholder="Senha"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    className="border rounded px-4 py-2"
                  />
                  <input
                    type="password"
                    placeholder="Confirmação de Senha"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    className="border rounded px-4 py-2"
                  />
                  <div className="flex gap-2  -mt-5  justify-between text-sm">
                    <div className="flex  p-1  gap-2 justify-between items-stretch">
                      {" "}
                      <input type="checkbox" />
                      <span>
                        Estou de acordo com os termos de serviço e a política de
                        privacidade do Desapegueime.
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-foreground text-white px-0 py-2 rounded font-semibold w-[40%] m-auto"
                  >
                    Criar Conta
                  </button>
                  <div className=" m-auto text-[0.7rem] -mt-5">
                    {" "}
                    <span className="text-gray-600">
                      Já tem uma conta?
                      <Link
                        href={"login"}
                        className="font-semibold text-foreground"
                      >
                        {" "}
                        Entrar
                      </Link>
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
