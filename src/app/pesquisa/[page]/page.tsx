/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "../../../../firebase";
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

import loadingAnimation from "../../../../public/animations/animation.json";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import FilterSidebar from "../../components/FilterSidebar";

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
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const pathReal = decodeURIComponent(pathname.split("/")[2]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Obter dados da coleção "categorias" no Firestore

        const querySnapshot = await getDocs(collection(db, "categorias"));
        console.log(querySnapshot);
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
        const q = query(
          collection(db, "products"),
          where("category", "==", pathReal)
        );

        const produtosSnapshot = await getDocs(q);
        const produtosData = produtosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // @ts-expect-error
        setProdutos(produtosData);

        const qc = query(collection(db, "products"));

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

  const getProdutosPorCategoria = (p0?: string) => {
    console.log("🚀 ~ getProdutosPorCategoria ~ p0:", p0);
    return produtos;
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
        <div className="w-full">
          <div className="flex flex-col items-center justify-center bg-foreground h-[106px] min-h-[106px]">
            <div className="container flex items-center justify-around sm:justify-between gap-4 sm:gap-20 p-2">
              {/* Logo */}
              <div className="flex-shrink-0 hidden sm:flex">
                <Link href={"/"}>
                  <Image
                    src={"./../logo-full.svg"}
                    width={200}
                    height={10}
                    alt="eu"
                  />
                </Link>
              </div>
              <div className="flex-shrink-0 sm:hidden flex">
                <Image src={"./../logo.svg"} width={45} height={45} alt="eu" />
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
                          src="../logo.svg" // Substitua pela URL do avatar do usuário
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
                <button className="bg-white rounded-md w-[150px] shadow-md flex justify-center items-center p-[0.2rem] select-none">
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

          <div className="flex flex-col gap-8 mt-12">
            <div className="flex flex-col m-auto w-[90%] sm:w-[72%]">
              {/* Nome da Categoria */}
              <div className="flex items-top justify-between">
                <h1 className="font-semibold pb-8 text-xl text-black">
                  Anuncios Relacionados
                </h1>
                <span className="items-center flex h-full">
                  ver todos <span className="text-xl"> {" >"} </span>
                </span>
              </div>

              {/* Produtos da Categoria */}
              <div className="grid grid-cols-4 gap-4 space-x-10">
                <div>
                  <FilterSidebar />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-1  justify-start col-span-3">
                  {getProdutosPorCategoria("").map((produto: any) => (
                    <div
                      key={produto.id}
                      className="flex flex-row items-center  rounded-lg shadow-md w-full gap-8 mt-2"
                    >
                      <div className="relative h-[12rem]">
                        {/* Imagem */}
                        <Image
                          src={produto.images?.[0]}
                          alt={produto.name}
                          className="h-full w-full object-cover rounded-md"
                          width={100}
                          height={100}
                        />
                      </div>
                      <div className=" flex  flex-col w-full  items-start gap-4 p-4">
                        <h2 className="font-semibold text-lg text-black   ">
                          {produto.description}
                        </h2>
                        <div className="flex w-full items-center gap-4">
                          <div className="w-full justify-between flex items-center">
                            <span className="text-foreground font-bold text-lg">
                              R$ {produto.price}
                            </span>

                            <span className="text-gray-400 line-through text-sm">
                              R$ {produto.price}
                            </span>
                          </div>
                          <div className=" w-full flex items-center justify-around py-2 px-2 gap-4 flex-grow">
                            {/* Botão Compre Agora */}
                            <button className="bg-violet-500 text-white px-2 py-1 text-[1rem] rounded shadow-md hover:bg-violet-700">
                              Compre agora
                            </button>
                            <button className="bg-white-500 text-foreground border border-foreground px-2 py-1 text-[1rem] rounded shadow-md hover:bg-violet-700">
                              Fazer Oferta
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:gap-8 mt-12">
            <div className="flex flex-col m-auto w-[90%] sm:w-[72%]">
              {/* Nome da Categoria */}
              <div className="flex items-top justify-between">
                <h1 className="font-semibold pb-8 text-lg text-gray-500">
                  Estão querendo comprar
                </h1>
                <span className="items-center flex h-full">
                  ver todos <span className="text-xl"> {" >"} </span>
                </span>
              </div>

              {/* Produtos em Grid Responsivo */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 justify-start">
                {produtosCompras.map((produto) => (
                  <div
                    key={produto.id}
                    className="flex flex-col items-center border rounded-lg shadow-md w-full"
                  >
                    <div className="relative w-full h-[12rem]">
                      {/* Imagem */}
                      <Image
                        src={produto.images?.[0]}
                        alt={produto.name}
                        className="h-full w-full object-cover rounded-md"
                        width={100}
                        height={100}
                      />
                    </div>

                    <h2 className="font-semibold text-sm text-black w-full p-2">
                      {produto.description}
                    </h2>
                    <div className="flex w-full justify-around items-baseline">
                      <span className="text-black font-regular">
                        R$ {produto.price}
                      </span>

                      <span className="text-gray-400 line-through text-sm">
                        R$ {produto.price}
                      </span>
                    </div>
                    <div className="border-t-[1px] w-full flex items-center justify-around py-2 px-2 gap-4">
                      {/* Botão Compre Agora */}
                      <button className="bg-red-500 text-white px-2 py-1 text-[0.7rem] rounded shadow-md hover:bg-violet-700 ">
                        <span className="hidden sm:block">Fazer Desapego</span>
                        <span className="sm:hidden block">Desapegar já!</span>
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
            </div>
          </div>

          <div className="w-full flex items-center justify-center mt-20">
            <div className="container justify-center flex">
              <Image
                src={"./banner-procurando.svg"}
                alt="eu"
                width={1300}
                height={300}
                className="w-[90%] h-auto hidden sm:block"
              />

              <Image
                src={"./procurando.svg"}
                alt="eu"
                width={1300}
                height={300}
                className="w-[90%] h-auto sm:hidden block"
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
      )}
    </>
  );
}
