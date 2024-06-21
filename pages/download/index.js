import RandomProduct from "@/components/random-product";
import { Link } from "react-router-dom";

const Download = () => {
    return(
        <>
            <div className="download-page">
                <div className="download-page-layouting">
                    <h1>Scan QR dibawah untuk mendownload Aplikasi</h1>
                    <div className="download-page-qris">
                        <img src="/images/unduh-qr.png" alt="Hallo Beauty" />
                    </div>
                    <span>Atau</span>
                    <a href="/download-file"><button>Download disini</button></a>
                </div>
                <RandomProduct/>
            </div>
            
        </>
    );
}

export default Download