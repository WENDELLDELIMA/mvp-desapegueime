/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";


import {
  AlertTriangle,
  Bell,
  Check,
  Clock,
  Copy,
  Grid,
  Heart,
  HomeIcon,
  LogOut,
  MessageCircle,
  MessagesSquare,
  Send,
  ShoppingBag,
  ShoppingCart,
  Star,
  StarIcon,
  ThumbsDown,
  ThumbsUp,
  User,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import loadingAnimation from "../../../public/animations/animation.json";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useProduct } from "@/context/productContext";

export default function VisualizarProduto() {
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
  const [loading, setLoading] = useState(false);

  const [oferta, setOferta] = useState(false);

  const [produtosCompras, setProdutosCompras] = useState<any[]>([]);

  const { product, setProduct } = useProduct();
  const [mainImage, setMainImage] = useState(product?.images?.[0] || 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=');


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
        const q = query(collection(db, "products"), where("type", "==", null));

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


  // ------------------------------- Comentários ----------------------------------- /

  const [comentarios, setComentarios] = useState<any[]>([]);
  const [novoComentario, setNovoComentario] = useState("");

  const productId = product?.id || "default-product-id";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unsubscribe = onSnapshot(
          collection(db, "products", productId, "comments"),
          (snapshot) => {
            const comments = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setComentarios(comments);
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [productId]);

  const adicionarComentario = async () => {
    if (!novoComentario.trim()) return;

    try {
      await addDoc(collection(db, "products", productId, "comments"), {
        userName: user?.username || "Anônimo",
        content: novoComentario,
        createdAt: new Date(),
      });

      setNovoComentario("");
    } catch (error) {
      console.error("Erro ao adicionar comentário: ", error);
    }
  };


  // ------------------ OFERTAS ----------------------- //

  const [ofertas, setOfertas] = useState<any[]>([]);
  const [novaOferta, setNovaOferta] = useState("");
  const [offerError, setOfferError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ofertasRef = collection(db, "products", productId, "offers");

        const unsubscribe = onSnapshot(ofertasRef, (snapshot) => {
          const ofertasAtualizadas = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOfertas(ofertasAtualizadas);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Erro ao buscar ofertas:", error);
      }
    };

    fetchData();
  }, [productId]);




  const enviarOferta = async () => {
    if (!novaOferta.trim()) return;

    try {
      if (product?.user !== user?.username) {
        await addDoc(collection(db, "products", productId, "offers"), {
          userName: user?.username || "Anônimo",
          price: novaOferta,
          createdAt: new Date(),
          status: '',
        });
      } else {
        setOfferError("Você não pode fazer uma oferta no proprio item.")
      }

      setNovaOferta("");
    } catch (error) {
      console.error("Erro ao adicionar comentário: ", error);
    }
  };

  if (!product) {
    return <p>Produto não encontrado</p>;
  }


  const atualizarStatusOferta = async (ofertaId: string, status: string, productId: string, ofertas: any[]) => {
    try {
      const ofertaRef = doc(db, "products", productId, "offers", ofertaId);

      // Atualizar o status da oferta selecionada
      await updateDoc(ofertaRef, { status });

      console.log(`Oferta ${ofertaId} atualizada para ${status}`);

      // Caso o status seja "aceita", recusar as outras ofertas
      if (status === "aceita") {
        for (const oferta of ofertas) {
          if (oferta.id !== ofertaId) {
            const outraOfertaRef = doc(db, "products", productId, "offers", oferta.id);
            await updateDoc(outraOfertaRef, { status: "recusada" });
          }
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar status da oferta:", error);
    }
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
                          src="logo.svg"
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

          {/* Caminho de pão - breadcrumb */}
          <div className="hidden px-72 py-2 sm:flex gap-2 h-20 content-center items-center border-b border-violet-500">
            <Link href="/">
              <HomeIcon className="text-gray-700" />
            </Link>
            <span className="text-gray-700">Home</span> /{" "}
            <span>{product.name}</span>
          </div>

          <div className="flex sm:hidden">
            <div className="px-4 flex flex-row gap-2 py-2 content-center items-center text-xs justify-between">
              <span className="text-gray-500">
                Vendido por <span className="text-violet-500">Luis Alves</span>
              </span>
              <div className="flex content-center items-center gap-1">
                <span className="text-gray-600">4,5</span>{" "}
                <StarIcon className="w-4" />
                <StarIcon className="w-4" />
                <StarIcon className="w-4" />
                <StarIcon className="w-4" />{" "}
                <span className="text-gray-600">(68)</span>
              </div>
            </div>
            <span className="px-4 text-gray-600">{product.name} - Usado</span>
          </div>

          <div className="flex flex-row mt-12 sm:px-44 sm:h-[40vh]">
            <div className="flex flex-row gap-6 w-full ">
              {/* Seção de imagens */}
              <div className="flex sm:flex-col flex-row gap-3 mt-1 overflow-auto">
                {product.images?.slice(0, 4).map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt={`${product.name} - ${index + 1}`}
                    className="h-20 w-20 object-cover rounded-sm cursor-pointer shadow-md"
                    width={90}
                    height={80}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>

              {/* Imagem principal */}
              <div className="w-3/4">
                <Image
                  src={mainImage}
                  alt={product.name}
                  className="h-full w-full rounded-sm object-contain shadow-md"
                  width={300}
                  height={300}
                />
              </div>


              {/* Informações do produto */}
              <div className="flex flex-col justify-between content-center  w-2/4 mb-2">
                <div>
                  <h3 className="text-3xl font-bold">{product.name} - {product.condition}</h3>
                  <p className="text-gray-600">
                    Descrição de venda do produto {product.name}
                  </p>
                </div>
                <div className="my-4">
                  <span className="text-3xl font-bold">
                    R${product.price},00
                  </span>
                  <p className="text-sm text-gray-500">
                    Última Oferta:{" "}
                    {ofertas.length > 0 ? (
                      <>
                        R$ {ofertas[ofertas.length - 1].price},00{" "}
                        <span className="text-gray-400">
                          {/* Exibe quanto tempo se passou desde a oferta */}
                          - {new Date(ofertas[ofertas.length - 1].createdAt.seconds * 1000).toLocaleTimeString()}
                        </span>
                      </>
                    ) : (
                      "Nenhuma oferta ainda"
                    )}
                  </p>
                </div>
                {oferta ? <>
                  <p className="text-xs empty:hidden text-red-500">{offerError}</p>
                  <div className="flex w-full mt-2 content-center items-center gap-3">
                    <input
                      type="number"
                      id="basic-input"
                      onChange={(e) => setNovaOferta(e.target.value)}
                      className=" rounded-md h-10 w-5/6 border shadow-sm sm:text-sm px-3 focus:outline-violet-500"
                      placeholder="Enviar oferta"
                    />

                    <button
                      className=""
                      onClick={enviarOferta}
                    >
                      <Send className="w-4" />
                    </button>

                    <button
                      className=""
                      onClick={() => setOferta(false)}
                    >
                      <X className="text-red-500" />
                    </button>
                  </div>

                </> : ''}
                <div className="flex gap-4 content-center items-center w-full">
                  <button className="bg-violet-500 text-white px-6 py-2 rounded-md hover:bg-violet-700 w-44">
                    Comprar
                  </button>
                  <button
                    onClick={() => setOferta(!oferta)}
                    className="border border-violet-500 text-violet-500 px-6 py-2 rounded-md w-44 hover:bg-violet-500 hover:text-white">
                    Fazer Oferta
                  </button>
                  <ShoppingCart
                    size={28}
                    className="cursor-pointer hover:text-violet-700"
                  />

                </div>


                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Heart
                      size={12}
                      className="cursor-pointer text-gray-700 hover:text-violet-500"
                    />
                    <span className="text-gray-700">Lista de desejos</span>
                  </div>
                  <div className="text-gray-700 flex gap-2 content-center">
                    <p>Compartilhar Produto</p>
                    <p className="text-sm">
                      <Copy
                        size={12}
                        className="cursor-pointer text-gray-700 hover:text-violet-500"
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Perfil do Anunciante */}
            <div className="ml-12 w-1/3 p-4 border-l">
              <h4 className="text-lg font-bold">Perfil do Anunciante</h4>
              <Link href="/perfilAnunciante" >
                <div className="flex items-center mt-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full">
                    <Image
                      src={
                        "https://maikon.biz/wp-content/uploads/2020/06/gerador-de-persona-maikonbiz.png"
                      }
                      alt={product.name}
                      className=" object-cover rounded-sm cursor-pointer"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="ml-4 flex gap-1">
                    <div>
                      <p className="text-sm font-medium">{product.user}</p>
                      <p className="text-sm text-gray-500">
                        Localização do usuário
                      </p>
                      <div className="text-sm flex flex-row content-center">
                        <span>5,0 </span>
                        <Star className="w-4 text-yellow-500" />
                        <Star className="w-4 text-yellow-500" />
                        <Star className="w-4 text-yellow-500" />
                        <Star className="w-4 text-yellow-500" />
                        <Star className="w-4 text-yellow-500" />
                      </div>
                    </div>
                    <button className="border border-violet-500 text-violet-500 rounded-md hover:bg-violet-500 hover:text-white w-14 h-5 text-xs">
                      Seguir
                    </button>
                    <MessagesSquare className="bg-violet-500 text-white rounded-full hover:bg-violet-500 p-0.5" />
                  </div>
                </div>
              </Link>
              <div className="mt-4 text-sm">
                <p>
                  <span className="font-bold text-gray-600">
                    Vendas Realizadas:
                  </span>{" "}
                  55
                </p>
                <p>
                  <span className="font-bold text-gray-600">
                    Tempo Médio de Envio:
                  </span>{" "}
                  7 Dias
                </p>
              </div>
            </div>
          </div>

          <hr className="mt-10 mx-44" />

          {/* Comentários e ofertas  */}
          <div className="grid grid-cols-3 mt-10 px-44 ">
            {/* Campo para perguntar ao vendedor */}
            <div className="col-span-2 px-14">
              <div className="grid grid-cols-4">
                <input
                  type="text"
                  id="basic-input"
                  onChange={(e) => setNovoComentario(e.target.value)}
                  className=" rounded-md ml-10 h-10 col-span-3 border shadow-sm sm:text-sm px-3 focus:outline-violet-500"
                  placeholder="Pergunte ao vendedor"
                />

                <button
                  className="bg-violet-500 text-white px-6 py-2 ml-4 rounded-md hover:bg-violet-700 "
                  onClick={adicionarComentario}
                >
                  {product.user === user?.username ? "Responder" : "Perguntar"}
                </button>
              </div>

              {/* Sessão de comentários */}
              <div className="grid gap-4 content-center items-center mt-12">

                {comentarios.map((comentario) => (
                  comentario.userName !== product.user ? <>
                    <div key={comentario.id}>
                      <div className="flex gap-2">
                        <Image
                          src={
                            "https://img.freepik.com/fotos-gratis/retrato-de-homem-branco-isolado_53876-40306.jpg"
                          }
                          alt={product.name}
                          className=" object-cover rounded-full w-20 h-20"
                          width={150}
                          height={80}
                        />

                        <div className="border border-violet-500 rounded-md p-4 text-gray-600 w-full">
                          <b className="text-gray-700">{comentario.userName}</b>
                          <p>
                            {comentario.content}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-row gap-2 justify-end mr-5 mt-2 text-gray-600">
                        <ThumbsUp /> <p>25</p>
                        <ThumbsDown /> <p>5</p>
                      </div>
                    </div>
                  </> :
                    <div>
                      <div className="flex ml-20 gap-2 w-full pr-20">
                        <Image
                          src={
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }
                          alt={product.name}
                          className=" object-cover rounded-full w-20 h-20"
                          width={150}
                          height={80}
                        />

                        <div className="border border-l-8 border-violet-500 rounded-md p-4 text-gray-600 w-full">
                          <b className="text-gray-700">{comentario.userName}</b>
                          <p>
                            {comentario.content}
                          </p>
                        </div>
                      </div>
                    </div>
                ))}

              </div>
            </div>

            <div className="h-full">
              <h3 className="text-3xl py-5">Histórico de ofertas</h3>
              {/* Ofertas */}
              <div className="overflow-auto h-96">
                {product.user === user?.username ? <>
                  {ofertas
                    // .filter((oferta) => oferta.status !== "")
                    .map((oferta) => (
                      <div key={oferta.id} className="mt-4">
                        <div className="flex gap-2 items-center">
                          <Image
                            src={
                              "https://img.freepik.com/fotos-gratis/retrato-de-homem-branco-isolado_53876-40306.jpg"
                            }
                            alt={product.name}
                            className=" object-cover rounded-full w-20 h-20"
                            width={150}
                            height={80}
                          />
                          <div>
                            <b className="text-gray-700">{oferta.userName}</b>
                            <div className={`border-2 ${oferta.status === '' ? "border-gray-500" : oferta.status === 'recusada' ? "border-red-500" : "border-green-500"} rounded-md p-4 h-20 text-gray-600 w-80  flex content-center items-center justify-between`}>
                              <p className="text-lg px-6">Ofertou R$ {oferta.price}</p>
                              <div className="gap-3 flex flex-col">
                                <div className="gap-1 flex">
                                  {oferta.status === "" ?
                                    <>
                                      {oferta?.id && (
                                        <>
                                          <button
                                            onClick={() =>
                                              atualizarStatusOferta(oferta.id, "recusada", productId, ofertas)
                                            }
                                          >
                                            <X className="text-red-500" />
                                          </button>
                                          <button
                                            onClick={() =>
                                              atualizarStatusOferta(oferta.id, "aceita", productId, ofertas)
                                            }
                                          >
                                            <Check className="text-green-500" />
                                          </button>
                                        </>
                                      )}</> : oferta.status === '' ? <Clock className="text-gray-500" /> : oferta.status === 'recusada' ? <X className="text-red-500" /> : <Check className="text-green-500" />
}

                                </div>
                                <span className="text-xs justify-end float-end sticky bottom-0">
                                  {new Date(oferta.createdAt.seconds * 1000).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </> : <>
                  {ofertas
                    // .filter((oferta) => oferta.status !== "")
                    .map((oferta) => (
                      <div key={oferta.id} className="mt-4">
                        <div className="flex gap-2 items-center">
                          <Image
                            src={
                              "https://img.freepik.com/fotos-gratis/retrato-de-homem-branco-isolado_53876-40306.jpg"
                            }
                            alt={product.name}
                            className=" object-cover rounded-full w-20 h-20"
                            width={150}
                            height={80}
                          />
                          <div>
                            <b className="text-gray-700">{oferta.userName}</b>
                            <div className={`border-2 ${oferta.status === '' ? "border-gray-500" : oferta.status === 'recusada' ? "Recusada" : "border-green-500"} rounded-md p-4 h-20 text-gray-600 w-80  flex content-center items-center justify-between`}>
                              <p className="text-lg px-6">Ofertou R$ {oferta.price}</p>
                              <div className="gap-3 flex flex-col">
                                {oferta.status === '' ? <Clock className="text-gray-500" /> : oferta.status === 'recusada' ? <X className="text-red-500" /> : <Check className="text-green-500" />}
                                <span className="text-xs justify-end float-end sticky bottom-0">
                                  {new Date(oferta.createdAt.seconds * 1000).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </>}

              </div>
            </div>
          </div>

          {/* quem comprou também viu */}
          <div className="flex flex-col gap-4 sm:gap-8 mt-12">
            <div className="flex flex-col m-auto w-[90%] sm:w-[72%]">
              {/* Nome da Categoria */}
              <div className="flex items-top justify-between">
                <h1 className="font-semibold pb-8 text-lg text-gray-500">
                  Quem comprou também viu
                </h1>
                <span className="items-center flex h-full">
                  ver todos <span className="text-xl"> {" >"} </span>
                </span>
              </div>

              {/* Produtos em Grid Responsivo */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 justify-start">
                {produtosCompras.slice(0, 4).map((produto) => (
                  <div
                    key={produto.id}
                    className="flex flex-col items-center border rounded-lg shadow-md w-full"
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

          {/* Rodapé */}
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
