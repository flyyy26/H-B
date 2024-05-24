import { MdLocalPhone } from "react-icons/md";
import { FaTruck } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa6";

export const keunggulanData = [
    {keunggulanImage: <MdLocalPhone/>, keunggulanAlt: 'Kontak Hallo Beauty', headingKeunggulan:'+62 812 2387 4300', keunggulanContent: 'Kami berkomitmen untuk memberikan pelayanan terbaik dan memastikan pengalaman berbelanja Anda di Hallo Beauty tetap menyenangkan.'},
    {keunggulanImage: <FaTruck/>, keunggulanAlt: 'Keunggulan Gratis Ongkir Hallo Beauty', headingKeunggulan:'GRATIS ONGKIR', keunggulanContent: 'Segera isi keranjang belanja Anda dengan koleksi produk kecantikan favorit dan rasakan kenyamanan berbelanja tanpa biaya pengiriman tambahan.'},
    {keunggulanImage: <FaBoxOpen/>, keunggulanAlt: 'Keunggulan Beragam Pilihan Hallo Beauty', headingKeunggulan:'BERAGAM PILIHAN', keunggulanContent: 'Jelajahi keberagaman kecantikan di Hallo Beauty dan temukan produk yang membuat anda menjadi terlihat cantik dan terawat secara alami.'},
]

export default function Keunggulan(){
    return(
        <div className="keunggulan-layout">
            {keunggulanData.map((keunggulanVar, index) => (
                <div className="keunggulan-box" key={index}>
                    <div className="icon-keunggulan">
                        {keunggulanVar.keunggulanImage}
                    </div>
                    <h1>{keunggulanVar.headingKeunggulan}</h1>
                    <p>{keunggulanVar.keunggulanContent}</p>
                </div>
            ))}
        </div>
    );
}