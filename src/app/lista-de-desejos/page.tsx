/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import {
  Bell,
  Grid,
  Heart,
  LogOut,
  MessageCircle,
  Pause,
  Pencil,
  ShoppingBag,
  ShoppingCart,
  Trash,
  User,
} from "lucide-react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import loadingAnimation from "../../../public/animations/animation.json";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useProduct } from "@/context/productContext";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

export default function listaDesejos() {
  const [loading, setLoading] = useState(false);
  console.log("🚀 ~ meusAnuncios ~ setLoading:", setLoading);
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
  // const [categorias, setCategorias] = useState<Category[]>([]);

  const [menuOpen, setMenuOpen] = useState(false);

  const [produtosCompras, setProdutosCompras] = useState<any[]>([]);
  console.log("🚀 ~ meusAnuncios ~ setProdutosCompras:", setProdutosCompras);
  console.log("🚀 ~ meusAnuncios ~ produtosCompras:", produtosCompras);

  //   const { product } = useProduct();

  const handleRemoveFromFavorites = async (productId: string) => {
    if (!user) {
      console.warn("Usuário não autenticado.");
      return;
    }

    try {
      // Busca o documento na coleção `favorites` com o `userId` e `productId`
      const favoritesRef = collection(db, "favorites");
      const favoritesQuery = query(
        favoritesRef,
        where("userId", "==", user.username.toLocaleLowerCase()),
        where("productId", "==", productId)
      );

      const favoritesSnapshot = await getDocs(favoritesQuery);

      if (!favoritesSnapshot.empty) {
        // Exclui todos os documentos encontrados
        favoritesSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        console.log("Produto removido dos favoritos:", productId);

        // Opcional: Atualizar lista de produtos no estado
        setProdutos((prevProdutos) =>
          prevProdutos.filter((produto) => produto.id !== productId)
        );
      } else {
        console.warn("Nenhum favorito encontrado para ser removido:", productId);
      }
    } catch (error) {
      console.error("Erro ao remover dos favoritos:", error);
    }
  };


  useEffect(() => {
    const fetchWishlistItems = async () => {
      if (!user?.username) {
        console.warn("Usuário não autenticado ou sem email.");
        return;
      }

      setLoading(true);

      try {
        // Consulta os favoritos do usuário
        const favoritesRef = collection(db, "favorites");
        const favoritesQuery = query(
          favoritesRef,
          where("userId", "==", user.username.toLocaleLowerCase())
        );
        const favoritesSnapshot = await getDocs(favoritesQuery);

        console.log(
          "Favorites encontrados:",
          favoritesSnapshot.docs.map((doc) => doc.data())
        );

        // Busca os produtos favoritos
        const wishlistProducts = await Promise.all(
          favoritesSnapshot.docs
            .map((docSnapshot) => {
              const data = docSnapshot.data();
              // Verifica se productId existe
              if (!data.productId) {
                console.warn("Documento sem productId:", data);
                return null;
              }
              return data.productId;
            })
            .filter(Boolean) // Remove valores nulos
            .map(async (productId) => {
              const productRef = doc(db, "products", productId);
              const productSnapshot = await getDoc(productRef);

              if (productSnapshot.exists()) {
                return {
                  id: productSnapshot.id,
                  ...(productSnapshot.data() as object),
                };
              }
              console.warn("Produto não encontrado para ID:", productId);
              return null; 
            })
        );

        console.log("Produtos na lista de desejos:", wishlistProducts);

        // Filtra valores nulos no caso de produtos inexistentes
        setProdutos(wishlistProducts.filter(Boolean));
      } catch (error) {
        console.error("Erro ao buscar itens da lista de desejos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistItems();
  }, [user]);




  const [produtos, setProdutos] = useState<any[]>([]);

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
                <Link href="/">
                  <Image
                    src={"./logo-full.svg"}
                    width={200}
                    height={10}
                    alt="eu"
                  />
                </Link>
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
                <Link href={"anunciar"}>
                  <button className="bg-white rounded-md w-[150px] shadow-md flex justify-center items-center p-[0.2rem] select-none">
                    Anunciar
                  </button>
                </Link>
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
                  className={`${menuOpen ? "flex" : "hidden"
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

          {/* Corpo da página */}
          <div className="h-screen w-full px-60 pt-10">
            <h3 className="text-5xl text-gray-800 px-4">Lista de desejos</h3>

            {loading ? (
              <div>Carregando...</div>
            ) : produtos.length === 0 ? (
              <div className="px-2 py-4 flex flex-row content-center items-center gap-2 ">
                <p>Nenhum anúncio favoritado encontrado :(</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4 w-full mt-6 overflow-auto">
                  {produtos.map((produto) => {
                    console.log(produto.data);
                    return (
                      <div
                        className=" w-full h-44 rounded-lg border border-neutral-300 gap-2 items content-center"
                        key={produto.createdAt}
                      >
                        <div className="flex">
                          <div className="content-center items-center w-full py-2 h-fit px-4 flex gap-6">
                            <Image
                              src={produto.images[0]}
                              alt={"Descrição do produto"}
                              className="h-36 w-36 object-cover rounded-lg cursor-pointer shadow-md"
                              width={1000}
                              height={1000}
                            />
                            <div className="flex flex-col w-2/4">
                              <span className="text-gray-600">
                                {produto.name}
                              </span>

                              <span className="font-bold">
                                R${produto.price},00
                              </span>
                            </div>
                          </div>

                          <div className="flex-col w-1/5 mx-12 py-2 h-full items-center flex gap-2 mt-6">
                            <button className="flex text-nowrap bg-violet-500 text-white px-6 py-2 rounded-md hover:bg-violet-700 w-48">
                              Compre agora
                            </button>
                            <div className="flex items gap-2">
                              <button className="flex gap-2 border border-violet-500 text-violet-500 px-6 py-2 rounded-md hover:bg-violet-500 hover:text-white w-36 text-nowrap">
                                Fazer oferta
                              </button>
                              <Heart
                                className="text-violet-500 fill-violet-500 rounded-md w-10 h-10 p-1 cursor-pointer hover:fill-violet-600 hover:border-violet-600"
                                onClick={() => handleRemoveFromFavorites(produto.id)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
