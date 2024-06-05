import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import Modal from '@/components/modal';
import { FaTrashAlt } from "react-icons/fa";
import RandomProducts from '@/components/random-product';
import { useRouter } from 'next/router';
import { GiFullMotorcycleHelmet } from "react-icons/gi";


const Pesanan = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [transactionDetails, setTransactionDetails] = useState({});
    const customerId = user ? user.userId : null;
    const [activeTab, setActiveTab] = useState('Semua');
    const [isOpenKurir, setIsOpenKurir] = useState(false);
    const [productDetails, setProductDetails] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [driver, setDriver] = useState(null);

    const toggleKurir = () => {
        setIsOpenKurir(!isOpenKurir);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!customerId) return;

            try {
                const response = await axios.get(`${baseUrl}/listTransaksi/${customerId}`);
                const data = response.data;

                console.log(response.data);

                if (data && data.data) {
                    const transactionsArray = Array.isArray(data.data) ? data.data : [data.data];
                    setTransactions(transactionsArray);

                    // Fetch transaction details and driver details for transactions with status 'pickup'
                    transactionsArray.forEach(transaction => {
                        fetchTransactionDetails(transaction.posTransaksiId);

                        if (transaction.status === 'pickup' && transaction.no_resi) {
                            fetchDriverDetails(transaction.no_resi);
                        }
                    });
                } else {
                    console.error('Expected an object with a data property but got:', data);
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [customerId]);

    const fetchDriverDetails = async (no_resi) => {
        try {
            const response = await axios.get(`${baseUrl}/driver/${no_resi}`);
            const driverDetails = response.data;
            console.log('Driver details:', driverDetails);
            // Handle driver details, e.g., update state
            setDriver(driverDetails); // Assuming you have state for driver details
        } catch (error) {
            console.error('Error fetching driver details:', error);
        }
    };

    useEffect(() => {
        transactions.forEach(transaction => {
            if (transaction.status === 'pickup') {
                fetchDriverDetails(transaction.no_resi);
            }
        });
    }, [transactions]);
    

    const fetchTransactionDetails = async (posTransaksiId) => {
        try {
            const response = await axios.get(`${baseUrl}/transaksiDetail/${posTransaksiId}`);
            if (response.status === 200) {
                const details = response.data.data;

                setTransactionDetails(prevDetails => ({
                    ...prevDetails,
                    [posTransaksiId]: details,
                }));

                details.forEach(detail => {
                    fetchProductDetails(detail.varianiId);
                });
            }
        } catch (error) {
            console.error('Error fetching transaction details:', error);
        }
    };

    const fetchProductDetails = async (varianiId) => {
        try {
            const response = await axios.get(`${baseUrl}/productId/${varianiId}`);
            if (response.status === 200) {
                const productData = response.data.data[0]; // Assuming data is in the first element of the array
                setProductDetails(prevDetails => ({
                    ...prevDetails,
                    [varianiId]: productData,
                }));
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    const handleDeleteTransaction = async (posTransaksiId) => {
        try {
            const responseTransaction = await axios.delete(`${baseUrl}/deleteTransaction/${posTransaksiId}`);
            if (responseTransaction.status === 200) {
                setTransactions(prevTransactions => (
                    prevTransactions.filter(transaction => transaction.posTransaksiId !== posTransaksiId)
                ));

                const transactionDetailsToDelete = transactionDetails[posTransaksiId] || [];
                for (let detail of transactionDetailsToDelete) {
                    await axios.delete(`${baseUrl}/deleteTransactionDetail/${detail.posTransaksiDetailId}`);
                }

                setTransactionDetails(prevDetails => {
                    const updatedDetails = { ...prevDetails };
                    delete updatedDetails[posTransaksiId];
                    return updatedDetails;
                });

                showModal();
            }
        } catch (error) {
            console.error('Error deleting transaction and details:', error);
            alert('Failed to delete transaction and details.');
        }
    };

    const showModal = () => {
        setModalIsOpen(true);
        setTimeout(() => {
            closeModal();
        }, 680);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleRetryPayment = async (transaction) => {
        try {
            const response = await fetch(`${baseUrl}/retry-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    order_id: transaction.order_id,
                    gross_amount: transaction.totalBayar,
                    first_name: transaction.customerName,
                    email: transaction.customerEmail,
                    phone: transaction.customerPhone
                })
            });

            const result = await response.json();

            if (response.ok) {
                window.snap.pay(result.token);
            } else {
                console.error('Failed to create transaction:', result.error);
            }
        } catch (error) {
            console.error('Error retrying payment:', error);
        }
    };

    const handleBuyNowClick = (posVarianId) => {
        router.push(`/catalog-product/${posVarianId}`);
      };

  return (
    <div className='container-small container-small-checkout'>
        <div className="tabs-container">
            <div className="tabs-layout">
                <div className="tabs">
                    <button
                    className={`tab ${activeTab === 'Semua' ? 'active' : ''}`}
                    onClick={() => handleTabClick('Semua')}
                    >
                    Semua
                    </button>
                    <button
                    className={`tab ${activeTab === 'Menunggu Pembayaran' ? 'active' : ''}`}
                    onClick={() => handleTabClick('Menunggu Pembayaran')}
                    >
                    Menunggu Pembayaran
                    </button>
                    <button
                    className={`tab ${activeTab === 'Sedang Dikemas' ? 'active' : ''}`}
                    onClick={() => handleTabClick('Sedang Dikemas')}
                    >
                    Sedang Dikemas
                    </button>
                    <button
                    className={`tab ${activeTab === 'Sedang Dikirim' ? 'active' : ''}`}
                    onClick={() => handleTabClick('Sedang Dikirim')}
                    >
                    Sedang Dikirim
                    </button>
                    <button
                    className={`tab ${activeTab === 'Selesai' ? 'active' : ''}`}
                    onClick={() => handleTabClick('Selesai')}
                    >
                    Selesai
                    </button>
                </div>
            </div>
            <div className="tab-content">
            {activeTab === 'Semua' && (
            <>
                {transactions.length === 0 ? (
                     <img src="/images/pesanan-kosong.png" alt="Pesanan H!b" className='pesanan-kosong'/>
                ) : (
                    transactions.map((transaction) => (
                        <>
                            {transaction.status === 'pending' && (
                                <div className='wait-pay' key={transaction.posTransaksiId}>
                                    <div className='wait-pay-header'>
                                        <span>Menunggu Pembayaran</span>
                                    </div>
                                    <div className='wait-pay-box-layout wait-pay-box-layout-pending'>
                                        {transactionDetails[transaction.posTransaksiId] && transactionDetails[transaction.posTransaksiId].map((detail) => (
                                            <div className='wait-pay-box' key={detail.posTransaksiDetailId}>
                                                <div className='wait-pay-box-header wait-pay-box-body'>
                                                    <div className="product-detail-cart product-detail-pesanan">
                                                        {productDetails[detail.varianiId] && (
                                                            <>
                                                                <div className="product-image-cart">
                                                                    <img src={`https://api.upos-conn.com/master/v1/${productDetails[detail.varianiId].gambar}`} alt={productDetails[detail.varianiId].namaVarian} />
                                                                </div>
                                                                <div className="product-desc-cart product-desc-cart-pesanan">
                                                                    <h2>{productDetails[detail.varianiId].namaProduk}</h2>
                                                                    <h3>{productDetails[detail.varianiId].namaVarian}</h3>
                                                                    <p>{detail.qty} Produk</p>
                                                                    <p>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</p>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="product-price-cart">
                                                        <span>{transaction.jenisPembayaranOnline}</span>
                                                    </div>
                                                    <div className="product-price-cart">
                                                        <span>{detail.qty}x</span>
                                                    </div>
                                                    <div className="product-price-cart">
                                                        <span>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</span>
                                                    </div>
                                                    <div className='action-pesanan'>
                                                        {transaction.status === 'pending' && (
                                                            <button className='cancel-pesanan' onClick={() => handleDeleteTransaction(transaction.posTransaksiId)}>Batalkan</button>
                                                        )}
                                                        {productDetails[detail.varianiId] && (
                                                            <button className='pay-pesanan' onClick={() => handleBuyNowClick(detail.varianiId)}>
                                                                Bayar
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {transaction.status === 'COD' && (
                                <div key={transaction.posTransaksiId} className='wait-pay'>
                                    {/* <div className='wait-pay-header wait-pay-header-brown'>
                                        <span>COD</span>
                                    </div> */}
                                    <div className='wait-pay-box-layout'>
                                        {transactionDetails[transaction.posTransaksiId] && transactionDetails[transaction.posTransaksiId].map(detail => (
                                            <div className='wait-pay-box' key={detail.posTransaksiDetailId}>
                                                <div className='wait-pay-box-header wait-pay-box-body wait-pay-box-dikemas'>
                                                    <div className="product-detail-cart product-detail-pesanan">
                                                        {productDetails[detail.varianiId] && (
                                                            <>
                                                                <div className="product-image-cart">
                                                                    <img src={`https://api.upos-conn.com/master/v1/${productDetails[detail.varianiId].gambar}`} alt={productDetails[detail.varianiId].namaVarian} />
                                                                </div>
                                                                <div className="product-desc-cart product-desc-cart-pesanan">
                                                                    <p></p>
                                                                    <h2>{productDetails[detail.varianiId].namaProduk}</h2>
                                                                    <h3>{productDetails[detail.varianiId].namaVarian}</h3>
                                                                    <p>{detail.qty} Produk</p>
                                                                    <p>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</p>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="product-price-cart">
                                                        <span>{transaction.jenisPembayaranOnline}</span>
                                                    </div>
                                                    <div className="product-price-cart">
                                                        <span>{detail.qty} Produk</span>
                                                    </div>
                                                    <div className="product-price-cart">
                                                        <span>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {transaction.status === 'LUNAS' && (
                                <div key={transaction.posTransaksiId} className='wait-pay'>
                                    <div className='wait-pay-box-layout'>
                                        {transactionDetails[transaction.posTransaksiId] && transactionDetails[transaction.posTransaksiId].map(detail => (
                                            <div className='wait-pay-box' key={detail.posTransaksiDetailId}>
                                                <div className='wait-pay-box-header wait-pay-box-body wait-pay-box-dikemas'>
                                                    <div className="product-detail-cart product-detail-pesanan">
                                                        {productDetails[detail.varianiId] && (
                                                            <>
                                                                <div className="product-image-cart">
                                                                    <img src={`https://api.upos-conn.com/master/v1/${productDetails[detail.varianiId].gambar}`} alt={productDetails[detail.varianiId].namaVarian} />
                                                                </div>
                                                                <div className="product-desc-cart product-desc-cart-pesanan">
                                                                    <p></p>
                                                                    <h2>{productDetails[detail.varianiId].namaProduk}</h2>
                                                                    <h3>{productDetails[detail.varianiId].namaVarian}</h3>
                                                                    <p>{detail.qty} Produk</p>
                                                                    <p>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</p>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="product-price-cart">
                                                        <span>{transaction.jenisPembayaranOnline}</span>
                                                    </div>
                                                    <div className="product-price-cart">
                                                        <span>{detail.qty} Produk</span>
                                                    </div>
                                                    <div className="product-price-cart">
                                                        <span>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {transaction.status === 'Packaged' && (
                                <div key={transaction.posTransaksiId} className='wait-pay'>
                                    <div className='wait-pay-header wait-pay-header-brown'>
                                        <span>Sedang Dikemas</span>
                                    </div>
                                    <div className='wait-pay-box-layout'>
                                        {transactionDetails[transaction.posTransaksiId] && transactionDetails[transaction.posTransaksiId].map(detail => (
                                            <div className='wait-pay-box' key={detail.posTransaksiDetailId}>
                                                <div className='wait-pay-box-header wait-pay-box-body wait-pay-box-dikemas'>
                                                    <div className="product-detail-cart product-detail-pesanan">
                                                        {productDetails[detail.varianiId] && (
                                                            <>
                                                                <div className="product-image-cart">
                                                                    <img src={`https://api.upos-conn.com/master/v1/${productDetails[detail.varianiId].gambar}`} alt={productDetails[detail.varianiId].namaVarian} />
                                                                </div>
                                                                <div className="product-desc-cart product-desc-cart-pesanan">
                                                                    <h2>{productDetails[detail.varianiId].namaProduk}</h2>
                                                                    <h3>{productDetails[detail.varianiId].namaVarian}</h3>
                                                                    <p>{detail.qty} Produk</p>
                                                                    <p>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</p>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="product-price-cart">
                                                        <span>{transaction.jenisPembayaranOnline}</span>
                                                    </div>
                                                    <div className="product-price-cart">
                                                        <span>{detail.qty} Produk</span>
                                                    </div>
                                                    <div className="product-price-cart">
                                                        <span>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {transaction.status === 'pickup' && (
                                <div key={transaction.posTransaksiId} className='wait-pay'>
                                    <div className='wait-pay-dikirim'>
                                        <div className='wait-pay-header wait-pay-header-brown'>
                                            <span>Sedang Dikirim</span>
                                        </div>
                                        <div className='driver-layout'>
                                            {transaction.no_resi === "-" ? (
                                                <div className='driver-box'>
                                                    <div className='driver-box-name'>
                                                        <p>Handle by JNE</p>
                                                    </div>
                                                    <span>|</span>
                                                    <p>Silahkan hubungi admin untuk info lebih lanjut</p>
                                                </div>
                                            ) : (
                                                driver && (
                                                    <div className='driver-box'>
                                                        <div className='driver-box-name'>
                                                            <GiFullMotorcycleHelmet />
                                                            <p>{driver.driver}</p>
                                                        </div>
                                                        <span>|</span>
                                                        <p>{driver.keterangan}</p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <div className='wait-pay-box-layout'>
                                        {transactionDetails[transaction.posTransaksiId] && transactionDetails[transaction.posTransaksiId].map(detail => (
                                            <>
                                            <div className='wait-pay-box' key={detail.posTransaksiDetailId}>
                                                <div className='wait-pay-box-header wait-pay-box-body wait-pay-box-dikemas'>
                                                    <div className="product-detail-cart product-detail-pesanan">
                                                        {productDetails[detail.varianiId] && (
                                                            <>
                                                                <div className="product-image-cart">
                                                                    <img src={`https://api.upos-conn.com/master/v1/${productDetails[detail.varianiId].gambar}`} alt={productDetails[detail.varianiId].namaVarian} />
                                                                </div>
                                                                <div className="product-desc-cart product-desc-cart-pesanan">
                                                                    <h2>{productDetails[detail.varianiId].namaProduk}</h2>
                                                                    <h3>{productDetails[detail.varianiId].namaVarian}</h3>
                                                                    <p>{detail.qty} Produk</p>
                                                                    <p>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</p>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="product-price-cart">
                                                        <span>{transaction.jenisPembayaranOnline}</span>
                                                    </div>
                                                    <div className="product-price-cart">
                                                        <span>{detail.qty} Produk</span>
                                                    </div>
                                                    <div className="product-price-cart">
                                                        <span>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            </>
                                        ))}
                                        {transaction.no_resi === "-" ? (
                                                    <p className='driver-mobile'>Silahkan hubungi admin untuk info lebih lanjut</p>
                                            ) : (
                                                driver && (
                                                    <p className='driver-mobile'>{driver.keterangan}</p>
                                                )
                                            )}
                                    </div>
                                </div>
                            )}
                            {transaction.status === 'pickupSuccess' && (
                                <div key={transaction.posTransaksiId} className='wait-pay'>
                                    <div className='wait-pay-header wait-pay-header-complete'>
                                        <span>Pesanan Selesai</span>
                                    </div>
                                    <div className='wait-pay-box-layout wait-pay-box-layout-success'>
                                        {transactionDetails[transaction.posTransaksiId] && transactionDetails[transaction.posTransaksiId].map(detail => (
                                            <div className='wait-pay-box' key={detail.posTransaksiDetailId}>
                                                <div className='wait-pay-box-header wait-pay-box-body wait-pay-box-header-success'>
                                                    <div className="product-detail-cart product-detail-pesanan">
                                                        {productDetails[detail.varianiId] && (
                                                            <>
                                                                <div className="product-image-cart">
                                                                    <img src={`https://api.upos-conn.com/master/v1/${productDetails[detail.varianiId].gambar}`} alt={productDetails[detail.varianiId].namaVarian} />
                                                                </div>
                                                                <div className="product-desc-cart product-desc-cart-pesanan">
                                                                    <h2>{productDetails[detail.varianiId].namaProduk}</h2>
                                                                    <h3>{productDetails[detail.varianiId].namaVarian}</h3>
                                                                    <p>{detail.qty} Produk</p>
                                                                    <p>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</p>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="product-price-cart">
                                                        <span>{transaction.jenisPembayaranOnline}</span>
                                                    </div>
                                                    <div className="product-price-cart">
                                                        <span>{detail.qty} Produk</span>
                                                    </div>
                                                    <div className="product-price-cart">
                                                        <span>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</span>
                                                    </div>
                                                    <div className='action-pesanan'>
                                                        {productDetails[detail.varianiId] && (
                                                            <button className='pay-pesanan' onClick={() => handleBuyNowClick(detail.varianiId)}>Beli Lagi</button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ))
                )}
            </>
        )}
                 {activeTab === 'Menunggu Pembayaran' && (
                    <>
                        {transactions.filter(transaction => transaction.status === 'pending').length === 0 ? (
                            <img src="/images/pesanan-kosong.png" alt="Pesanan H!b" className='pesanan-kosong'/>
                        ) : (
                            transactions.map((transaction) => (
                                transaction.status === 'pending' && (
                                    <div className='wait-pay' key={transaction.posTransaksiId}>
                                        <div className='wait-pay-header'>
                                            <span>Menunggu Pembayaran</span>
                                        </div>
                                        <div className='wait-pay-box-layout wait-pay-box-layout-pending'>
                                            {transactionDetails[transaction.posTransaksiId] && transactionDetails[transaction.posTransaksiId].map((detail) => (
                                                <div className='wait-pay-box' key={detail.posTransaksiDetailId}>
                                                    <div className='wait-pay-box-header wait-pay-box-body'>
                                                        <div className="product-detail-cart product-detail-pesanan">
                                                            {productDetails[detail.varianiId] && (
                                                                <>
                                                                    <div className="product-image-cart">
                                                                        <img src={`https://api.upos-conn.com/master/v1/${productDetails[detail.varianiId].gambar}`} alt={productDetails[detail.varianiId].namaVarian} />
                                                                    </div>
                                                                    <div className="product-desc-cart product-desc-cart-pesanan">
                                                                        <h2>{productDetails[detail.varianiId].namaProduk}</h2>
                                                                        <h3>{productDetails[detail.varianiId].namaVarian}</h3>
                                                                        <p>{detail.qty} Produk</p>
                                                                        <p>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</p>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="product-price-cart">
                                                            <span>{transaction.jenisPembayaranOnline}</span>
                                                        </div>
                                                        <div className="product-price-cart">
                                                            <span>{detail.qty}x</span>
                                                        </div>
                                                        <div className="product-price-cart">
                                                            <span>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</span>
                                                        </div>
                                                        <div className='action-pesanan'>
                                                            {transaction.status === 'pending' && (
                                                                <button className='cancel-pesanan' onClick={() => handleDeleteTransaction(transaction.posTransaksiId)}>Batalkan</button>
                                                            )}
                                                            {productDetails[detail.varianiId] && (
                                                                <button className='pay-pesanan' onClick={() => handleBuyNowClick(detail.varianiId)}>
                                                                    Bayar
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))
                        )}
                    </>
                )}
                {activeTab === 'Sedang Dikemas' && (
                    <>
                        {transactions.filter(transaction => transaction.status === 'Packaged').length === 0 ? (
                             <img src="/images/pesanan-kosong.png" alt="Pesanan H!b" className='pesanan-kosong'/>
                        ) : (
                            transactions.map((transaction) => (
                                transaction.status === 'Packaged' && (
                                    <div key={transaction.posTransaksiId} className='wait-pay'>
                                        <div className='wait-pay-header wait-pay-header-brown'>
                                            <span>Sedang Dikemas</span>
                                        </div>
                                        <div className='wait-pay-box-layout'>
                                            {transactionDetails[transaction.posTransaksiId] && transactionDetails[transaction.posTransaksiId].map(detail => (
                                                <div className='wait-pay-box' key={detail.posTransaksiDetailId}>
                                                    <div className='wait-pay-box-header wait-pay-box-body wait-pay-box-dikemas'>
                                                        <div className="product-detail-cart product-detail-pesanan">
                                                            {productDetails[detail.varianiId] && (
                                                                <>
                                                                    <div className="product-image-cart">
                                                                        <img src={`https://api.upos-conn.com/master/v1/${productDetails[detail.varianiId].gambar}`} alt={productDetails[detail.varianiId].namaVarian} />
                                                                    </div>
                                                                    <div className="product-desc-cart product-desc-cart-pesanan">
                                                                        <h2>{productDetails[detail.varianiId].namaProduk}</h2>
                                                                        <h3>{productDetails[detail.varianiId].namaVarian}</h3>
                                                                        <p>{detail.qty} Produk</p>
                                                                        <p>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</p>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="product-price-cart">
                                                            <span>{transaction.jenisPembayaranOnline}</span>
                                                        </div>
                                                        <div className="product-price-cart">
                                                            <span>{detail.qty} Produk</span>
                                                        </div>
                                                        <div className="product-price-cart">
                                                            <span>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))
                        )}
                    </>
                )}
                {activeTab === 'Sedang Dikirim' && (
                    <>
                        {transactions.filter(transaction => transaction.status === 'pickup').length === 0 ? (
                             <img src="/images/pesanan-kosong.png" alt="Pesanan H!b" className='pesanan-kosong'/>
                        ) : (
                            transactions.map((transaction) => (
                                transaction.status === 'pickup' && (
                                    <div key={transaction.posTransaksiId} className='wait-pay'>
                                        <div className='wait-pay-dikirim'>
                                            <div className='wait-pay-header wait-pay-header-brown'>
                                                <span>Sedang Dikirim</span>
                                            </div>
                                            <div className='driver-layout'>
                                                {transaction.no_resi === "-" ? (
                                                    <div className='driver-box'>
                                                        <div className='driver-box-name'>
                                                            <p>Handle by JNE</p>
                                                        </div>
                                                        <span>|</span>
                                                        <p>Silahkan hubungi admin untuk info lebih lanjut</p>
                                                    </div>
                                                ) : (
                                                    driver && (
                                                        <div className='driver-box'>
                                                            <div className='driver-box-name'>
                                                                <GiFullMotorcycleHelmet />
                                                                <p>{driver.driver}</p>
                                                            </div>
                                                            <span>|</span>
                                                            <p>{driver.keterangan}</p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <div className='wait-pay-box-layout'>
                                            {transactionDetails[transaction.posTransaksiId] && transactionDetails[transaction.posTransaksiId].map(detail => (
                                                <>
                                                <div className='wait-pay-box' key={detail.posTransaksiDetailId}>
                                                    <div className='wait-pay-box-header wait-pay-box-body wait-pay-box-dikemas'>
                                                        <div className="product-detail-cart product-detail-pesanan">
                                                            {productDetails[detail.varianiId] && (
                                                                <>
                                                                    <div className="product-image-cart">
                                                                        <img src={`https://api.upos-conn.com/master/v1/${productDetails[detail.varianiId].gambar}`} alt={productDetails[detail.varianiId].namaVarian} />
                                                                    </div>
                                                                    <div className="product-desc-cart product-desc-cart-pesanan">
                                                                        <h2>{productDetails[detail.varianiId].namaProduk}</h2>
                                                                        <h3>{productDetails[detail.varianiId].namaVarian}</h3>
                                                                        <p>{detail.qty} Produk</p>
                                                                        <p>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</p>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="product-price-cart">
                                                            <span>{transaction.jenisPembayaranOnline}</span>
                                                        </div>
                                                        <div className="product-price-cart">
                                                            <span>{detail.qty} Produk</span>
                                                        </div>
                                                        <div className="product-price-cart">
                                                            <span>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                </>
                                            ))}
                                            {transaction.no_resi === "-" ? (
                                                        <p className='driver-mobile'>Silahkan hubungi admin untuk info lebih lanjut</p>
                                                ) : (
                                                    driver && (
                                                        <p className='driver-mobile'>{driver.keterangan}</p>
                                                    )
                                                )}
                                        </div>
                                    </div>
                                )
                            ))
                        )}
                    </>
                )}
                {activeTab === 'Selesai' && (
                    <>
                        {transactions.filter(transaction => transaction.status === 'pickupSuccess').length === 0 ? (
                             <img src="/images/pesanan-kosong.png" alt="Pesanan H!b" className='pesanan-kosong'/>
                        ) : (
                            transactions.map((transaction) => (
                                transaction.status === 'pickupSuccess' && (
                                    <div key={transaction.posTransaksiId} className='wait-pay'>
                                        <div className='wait-pay-header wait-pay-header-complete'>
                                            <span>Pesanan Selesai</span>
                                        </div>
                                        <div className='wait-pay-box-layout wait-pay-box-layout-success'>
                                            {transactionDetails[transaction.posTransaksiId] && transactionDetails[transaction.posTransaksiId].map(detail => (
                                                <div className='wait-pay-box' key={detail.posTransaksiDetailId}>
                                                    <div className='wait-pay-box-header wait-pay-box-body wait-pay-box-header-success'>
                                                        <div className="product-detail-cart product-detail-pesanan">
                                                            {productDetails[detail.varianiId] && (
                                                                <>
                                                                    <div className="product-image-cart">
                                                                        <img src={`https://api.upos-conn.com/master/v1/${productDetails[detail.varianiId].gambar}`} alt={productDetails[detail.varianiId].namaVarian} />
                                                                    </div>
                                                                    <div className="product-desc-cart product-desc-cart-pesanan">
                                                                        <h2>{productDetails[detail.varianiId].namaProduk}</h2>
                                                                        <h3>{productDetails[detail.varianiId].namaVarian}</h3>
                                                                        <p>{detail.qty} Produk</p>
                                                                        <p>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</p>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="product-price-cart">
                                                            <span>{transaction.jenisPembayaranOnline}</span>
                                                        </div>
                                                        <div className="product-price-cart">
                                                            <span>{detail.qty} Produk</span>
                                                        </div>
                                                        <div className="product-price-cart">
                                                            <span>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</span>
                                                        </div>
                                                        <div className='action-pesanan'>
                                                            {productDetails[detail.varianiId] && (
                                                                <button className='pay-pesanan' onClick={() => handleBuyNowClick(detail.varianiId)}>Beli Lagi</button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
        <div className='container-random'>
        <RandomProducts numberOfProducts={8}/>
        </div>
        <Modal isOpen={modalIsOpen} onClose={closeModal}>
            <FaTrashAlt className="check-cart"/>
            <p className="check-notif-cart">Berhasil dihapus</p>
        </Modal>
    </div>
  );
};

export default Pesanan;
