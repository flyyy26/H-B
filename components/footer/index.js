import Logo from '@/public/images/logo.png'
import Image from 'next/image'
import Link from 'next/link'
import { FaInstagram, FaWhatsapp, FaFacebook, FaTiktok } from "react-icons/fa";


export default function Footer(){
    return (
        <>
            <div className="footer">
                <div className="footer-menu">
                    <div className="logo-footer">
                        <Image src={Logo} alt="Logo Hallo Beauty" width={150}/>
                    </div>
                    <div className="detail-company-footer">
                        <h1>H!BI</h1>
                        <p>Singaparna, Cipakat, Kec. Singaparna, <br/>Kabupaten Tasikmalaya, Jawa Barat 46417</p>
                        <p>Telp: +62812 2387 4300</p>
                    </div>
                </div>
                <div className="footer-menu footer-menu-mid">
                    <h2>Perusahaan</h2>
                    <ul>
                        <li><Link href="#">Tentang Kami</Link></li>
                        <li><Link href="#">Syarat & Ketentuan</Link></li>
                        <li><Link href="#">Kebijakan Privasi</Link></li>
                        <li><Link href="#">Pengaturan Cookie</Link></li>
                    </ul>
                </div>
                <div className="footer-menu footer-menu-mid-2">
                    <h2>Bantuan</h2>
                    <ul>
                        <li><Link href="#">Kategori Produk</Link></li>
                        <li><Link href="#">Kontak Kami</Link></li>
                        <li><Link href="/posts">Blog</Link></li>
                        <li><Link href="#">Diskon Produk</Link></li>
                    </ul>
                </div>
                <div className="footer-menu">
                    <h2>Temukan Hallo Beauty</h2>
                    <div className="social-media-footer">
                        <Link href="#">
                            <div className="social-media-footer-box">
                                <FaInstagram />
                            </div>
                        </Link>
                        <Link href="#">
                            <div className="social-media-footer-box">
                                <FaWhatsapp />
                            </div>
                        </Link>
                        <Link href="#">
                            <div className="social-media-footer-box">
                                <FaFacebook />
                            </div>
                        </Link>
                        <Link href="#">
                            <div className="social-media-footer-box">
                                <FaTiktok />
                            </div>
                        </Link>
                    </div>
                    <p>Email: <br/>hallobeautyy@gmail.com</p>
                </div>
            </div>
            <div className="copyright">
                <span>Copyright 2023 © All Right Reserved Hallo Beauty</span>
            </div>
        </>
    )
}