// import { Context } from "@/context";
// import { useContext } from "react";
// import { IoMdHeart, IoMdTrash } from "react-icons/io";
// import Link from "next/link";
// import { IoCart } from "react-icons/io5";
// import RandomProducts from "@/components/random-product";

// export default function Favorit(){
//     const {favoritItems, handleAddToCart, cartItems, removeFromFavorit} = useContext(Context);

//     console.log(favoritItems);

//     // Perbaikan pada disabled dan penggunaan handleAddToCart
//     return(
//             <div className="container-small">
//                 <div className="heading-small">
//                     <h1>Favorit <span>beauty bestie</span></h1>
//                 </div>
//                 <div className="layout-cart-dekstop">
//                     <div className="header-cart-dekstop-box">
//                         <h1>Produk</h1>
//                     </div>
//                     <div className="header-cart-dekstop-box">
//                         <h1>Kategori</h1>
//                     </div>
//                     <div className="header-cart-dekstop-box">
//                         <h1>Stok Produk</h1>
//                     </div>
//                     <div className="header-cart-dekstop-box">
//                         <h1>Harga Satuan</h1>
//                     </div>
//                     <div className="header-cart-dekstop-box">
//                         <h1>Aksi</h1>
//                     </div>
//                 </div>
//                 {favoritItems && favoritItems.length > 0 ? favoritItems.map(item => (
//                 <div className="layout-cart-dekstop layout-cart-dekstop-item" key={item.id}>
//                     <div className="product-detail-cart">
//                         <div className="product-image-cart">
//                             <img src={item.images[0]} alt={item.title}/>
//                         </div>
//                         <div className="product-desc-cart">
//                             <h2>{item.brand}</h2>
//                             <h3>{item.title}</h3>
//                         </div>
//                     </div>
//                     <div className="product-price-cart">
//                         <span>{item.category}</span>
//                     </div>
//                     <div className="product-price-cart">
//                         <span>{item.stock}</span>
//                     </div>
//                     <div className="product-price-cart">
//                         <span>{item.price}</span>
//                     </div>
//                     <div className="product-price-cart product-price-cart-action">
//                         <button 
//                             disabled={cartItems.some(cartItem => cartItem.id === item.id)} 
//                             onClick={() => handleAddToCart(item)}><IoCart />
//                         </button>
//                         <button onClick={()=> removeFromFavorit(item.id)}><IoMdTrash/></button>
//                     </div>
//                 </div>
//                 )) : "Belum ada produk favorit"}

//                 <RandomProducts numberOfProducts={8} />
//             </div>

//     )
// }
