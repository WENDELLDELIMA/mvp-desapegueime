/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
  Bell,
  Grid,
  Heart,
  LogOut,
  MessageCircle,
  ShoppingBag,
  ShoppingCart,
  User,
} from "lucide-react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import loadingAnimation from "../../../public/animations/animation.json";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import CategorySelector from "./components/Category";

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
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) {
      alert("Para anunciar é necessario estar logado!");
      router.push("login");
    }
  }, [user]);

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
      setTimeout(() => {
        setLoading(false);
      }, 2700);
    };

    fetchData();
  }, []);
  //@ts-expect-error
  const getProdutosPorCategoria = (category) => {
    console.log(10);
    //@ts-expect-error
    return produtos.filter((produto) => produto.category === category);
  };
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
        <div className="w-full h-screen flex flex-col">
          <div className="flex flex-col items-center justify-center bg-foreground h-[106px] min-h-[106px] z-50">
            <div className="container flex items-center justify-around sm:justify-between gap-4 sm:gap-20 p-2">
              {/* Logo */}
              <div className="flex-shrink-0 hidden sm:flex">
                <Image
                  src={"./logo-full.svg"}
                  width={200}
                  height={10}
                  alt="eu"
                />
              </div>
              <div className="flex-shrink-0 sm:hidden flex">
                <Image src={"./logo.svg"} width={45} height={45} alt="eu" />
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
              <div className="sm:flex hidden gap-2 ">
                <div className="relative">
                  {!user ? (
                    // Botão de Login
                    <Link href={"login"} className="contents">
                      <button className="bg-white rounded-md p-2 w-[150px] shadow-md flex justify-center items-center">
                        Entrar
                      </button>
                    </Link>
                  ) : (
                    // Dropdown Menu
                    <div className="relative">
                      {/* Avatar e Nome do Usuário */}
                      <div
                        className="flex items-center cursor-pointer  w-[300px] p-[0.35rem] border rounded-lg justify-around"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      >
                        <Image
                          src="logo.svg" // Substitua pela URL do avatar do usuário
                          alt="Avatar"
                          width={5}
                          height={5}
                          className="w-3 h-3 bg-red"
                        />
                        <span className="ml-2 text-white text-sm select-none">
                          {user.username}
                        </span>
                      </div>

                      {/* Menu Dropdown */}
                      {dropdownOpen && (
                        <div className="absolute top-full mt-2 right-0 bg-white shadow-lg rounded-md w-[300px] z-50">
                          <ul className="divide-y divide-gray-200 ">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-8 ">
                              <User className="w-4 h-4" />
                              <Link href="/meu-cadastro">Meu Cadastro</Link>
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-8">
                              <Bell className="w-4 h-4" />
                              <Link href="/notificacoes">Notificações</Link>
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-8">
                              <MessageCircle className="w-4 h-4" />
                              <Link href="/chat">Chat</Link>
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-8">
                              <Grid className="w-4 h-4" />
                              <Link href="/meus-anuncios">Meus Anúncios</Link>
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-8">
                              <ShoppingBag className="w-4 h-4" />
                              <Link href="/minhas-vendas">Minhas Vendas</Link>
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-8">
                              <ShoppingCart className="w-4 h-4" />
                              <Link href="/minhas-compras">Minhas Compras</Link>
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-8">
                              <Heart className="w-4 h-4" />
                              <Link href="/lista-de-desejos">
                                Lista de Desejos
                              </Link>
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-8"
                              onClick={() => {
                                logout();
                                router.push("/"); // Redireciona para a página de login
                              }}
                            >
                              <LogOut className="w-4 h-4" />
                              <Link href="/lista-de-desejos">Sair</Link>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <button className="bg-white sm:hidden rounded-md p-2 shadow-md flex justify-center items-center">
                  <ShoppingBag />
                </button>
              </div>
            </div>
          </div>
          <CategorySelector />
        </div>
      )}
    </>
  );
}
