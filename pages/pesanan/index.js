import { useState } from 'react';
import RandomProducts from '@/components/random-product';
import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import Modal from '@/components/modal';
import { FaTrashAlt } from "react-icons/fa";


const Pesanan = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [transactionDetails, setTransactionDetails] = useState({});
  const customerId = user ? user.posLoginId : null;
  const [activeTab, setActiveTab] = useState('Semua');
  const [isOpenKurir, setIsOpenKurir] = useState(false);
  const [productDetails, setProductDetails] = useState({});

  const toggleKurir = () => {
    setIsOpenKurir(!isOpenKurir);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/api/listTransaksi');
        const data = response.data;
        const filteredTransactions = data.data.filter(transaction => transaction.customerId === customerId);
        setTransactions(filteredTransactions);
        console.log(response.data)
        // Fetch details for each transaction
        filteredTransactions.forEach(transaction => {
          fetchTransactionDetails(transaction.posTransaksiId);
          
        });
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    if (customerId) {
      fetchTransactions();
    }
  }, [customerId]);

  const fetchTransactionDetails = async (posTransaksiId) => {
    try {
      const response = await axios.get(`/api/transaksiDetail/${posTransaksiId}`);
      if (response.status === 200) {
        const details = response.data.data;

        // Fetch product details for each varianiId in transaction details
        details.forEach(detail => {
          fetchProductDetails(detail.varianiId);
        });

        setTransactionDetails(prevDetails => ({
          ...prevDetails,
          [posTransaksiId]: details
        }));
      }
    } catch (error) {
      console.error('Error fetching transaction details:', error);
    }
  };

  const fetchProductDetails = async (varianiId) => {
    try {
      const response = await axios.get(`/api/productId/${varianiId}`);
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
      // Delete the transaction
      const responseTransaction = await axios.delete(`/api/deleteTransaction/${posTransaksiId}`);
      if (responseTransaction.status === 200) {
        // Remove the deleted transaction from state
        setTransactions(prevTransactions => (
          prevTransactions.filter(transaction => transaction.posTransaksiId !== posTransaksiId)
        ));

        // Also delete all transaction details for this transaction
        const transactionDetailsToDelete = transactionDetails[posTransaksiId] || [];
        for (let detail of transactionDetailsToDelete) {
          await axios.delete(`/api/deleteTransactionDetail/${detail.posTransaksiDetailId}`);
        }

        // Remove transaction details from state
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

  const [modalIsOpen, setModalIsOpen] = useState(false);


  function showModal() {
    setModalIsOpen(true);

    // Set timeout to close the modal after 3 seconds
    setTimeout(() => {
      closeModal();
    }, 680);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  const handleRetryPayment = async (transaction) => {
    const response = await fetch('http://localhost:4000/api/retry-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            order_id: transaction.order_id,  // Gunakan order_id dari transaction
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
                {activeTab === 'Semua' && 
                <>
                {transactions.map((transaction) => (
                    transaction.status === 'pending' && (
                    <div className='wait-pay' key={transaction.posTransaksiId}>
                        <div className='wait-pay-header'>
                            <span>Menunggu Pembayaran</span>
                        </div>
                        <div className='wait-pay-box-layout'>
                        {transactionDetails[transaction.posTransaksiId] &&
                        transactionDetails[transaction.posTransaksiId].map((detail) => (
                            <div className='wait-pay-box' key={detail.posTransaksiDetailId}>
                                <div className='wait-pay-box-header wait-pay-box-body'>
                                    <div className="product-detail-cart">
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
                                        <span>{detail.qty} Produk</span>
                                    </div>
                                    <div className="product-price-cart">
                                        <span>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</span>
                                    </div>
                                    
                                    <div className='action-pesanan'>
                                        {transaction.status === 'pending' && (
                                        <button className='cancel-pesanan' onClick={() => handleDeleteTransaction(transaction.posTransaksiId)}>Batalkan Pesanan</button>
                                    )}
                                        <button className='pay-pesanan'>Bayar Sekarang</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                    )
                    ))}
                    {transactions.map((transaction) => (
                        transaction.status === 'COD' && (
                            <div key={transaction.posTransaksiId} className='wait-pay'>
                            <div className='wait-pay-header wait-pay-header-brown'>
                                <span>Sedang Dikemas</span>
                            </div>
                            <div className='wait-pay-box-layout'>
                                {transactionDetails[transaction.posTransaksiId] &&
                                transactionDetails[transaction.posTransaksiId].map((detail) => (
                                    <div className='wait-pay-box' key={detail.posTransaksiDetailId}>
                                        <div className='wait-pay-box-header wait-pay-box-body wait-pay-box-dikemas'>
                                            <div className="product-detail-cart">
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
                        ))}
                        {transactions.map((transaction) => (
                        transaction.status === 'LUNAS' && (
                            <div key={transaction.posTransaksiId} className='wait-pay'>
                            <div className='wait-pay-header wait-pay-header-brown'>
                                <span>Sedang Dikemas</span>
                            </div>
                            <div className='wait-pay-box-layout'>
                                {transactionDetails[transaction.posTransaksiId] &&
                                transactionDetails[transaction.posTransaksiId].map((detail) => (
                                    <div className='wait-pay-box' key={detail.posTransaksiDetailId}>
                                        <div className='wait-pay-box-header wait-pay-box-body wait-pay-box-dikemas'>
                                        <div className="product-detail-cart">
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
                                            <span>{detail.qty} Produk</span>
                                        </div>
                                        <div className="product-price-cart">
                                            <span>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</span>
                                        </div>
                                        <div className='action-pesanan'>
                                            <div className='kurir-image' onClick={toggleKurir}>
                                            <img src='images/kurir-image.png' alt='Kurir Image' />
                                            </div>
                                            {isOpenKurir && (
                                            <div className='popup-checkout' onClick={toggleKurir}>
                                                <div className='kurir-image-popup'>
                                                <img src='images/kurir-image.png' alt='Kurir Image' />
                                                </div>
                                            </div>
                                            )}
                                            <div className='kurir-details'>
                                            <h3>Siti Aisyach</h3>
                                            <span>Z 1234 HJ</span>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            </div>
                        )
                        ))}
                    
                </>
                }
                {activeTab === 'Menunggu Pembayaran' && (
                    <>
                        {transactions.map((transaction) => (
                    transaction.status === 'pending' && (
                    <div className='wait-pay' key={transaction.posTransaksiId}>
                        <div className='wait-pay-header'>
                            <span>Menunggu Pembayaran</span>
                        </div>
                        <div className='wait-pay-box-layout'>
                            {transactionDetails[transaction.posTransaksiId] &&
                            transactionDetails[transaction.posTransaksiId].map((detail) => (
                                <div className='wait-pay-box' key={detail.posTransaksiDetailId}>
                                    <div className='wait-pay-box-header wait-pay-box-body'>
                                        <div className="product-detail-cart">
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
                                            <span>{detail.qty} Produk</span>
                                        </div>
                                        <div className="product-price-cart">
                                            <span>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(detail.total)}</span>
                                        </div>
                                        
                                        <div className='action-pesanan'>
                                            {transaction.status === 'pending' && (
                                            <button className='cancel-pesanan' onClick={() => handleDeleteTransaction(transaction.posTransaksiId)}>Batalkan Pesanan</button>
                                        )}
                                            <button className='pay-pesanan'>Bayar Sekarang</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    )
                    ))}
                    </>
                    )}
                {activeTab === 'Sedang Dikemas' && (
                    <>
                        {transactions.map((transaction) => (
                        transaction.status === 'COD' && (
                            <div key={transaction.posTransaksiId} className='wait-pay'>
                            <div className='wait-pay-header wait-pay-header-brown'>
                                <span>Sedang Dikemas</span>
                            </div>
                            <div className='wait-pay-box-layout'>
                                {transactionDetails[transaction.posTransaksiId] &&
                                transactionDetails[transaction.posTransaksiId].map((detail) => (
                                <div className='wait-pay-box' key={detail.posTransaksiDetailId}>
                                    <div className='wait-pay-box-header wait-pay-box-body wait-pay-box-dikemas'>
                                    <div className="product-detail-cart">
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
                        ))}
                        {transactions.map((transaction) => (
                        transaction.status === 'LUNAS' && (
                            <div key={transaction.posTransaksiId} className='wait-pay'>
                            <div className='wait-pay-header wait-pay-header-brown'>
                                <span>Sedang Dikemas</span>
                            </div>
                            <div className='wait-pay-box-layout'>
                            {transactionDetails[transaction.posTransaksiId] &&
                            transactionDetails[transaction.posTransaksiId].map((detail) => (
                            <div className='wait-pay-box' key={detail.posTransaksiDetailId}>
                                <div className='wait-pay-box-header wait-pay-box-body wait-pay-box-dikemas'>
                                <div className="product-detail-cart">
                                    {productDetails[detail.varianiId] && (
                                        <>
                                        <div className="product-image-cart">
                                            <img src={`https://api.upos-conn.com/master/v1/${productDetails[detail.varianiId].gambar}`} alt={productDetails[detail.varianiId].namaVarian} />
                                        </div>
                                        <div className="product-desc-cart">
                                            <h2>{productDetails[detail.varianiId].namaProduk}</h2>
                                            <h3>{productDetails[detail.varianiId].namaVarian}</h3>
                                        </div>
                                        </>
                                    )}
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
                        ))}
                    </>
                    )}
                {activeTab === 'Sedang Dikirim' && 
                    <div className='wait-pay'>
                        <div className='wait-pay-header wait-pay-header-brown'>
                            <span>Sedang Dikirim</span>
                        </div>
                        <div className='wait-pay-box'>
                            <div className='wait-pay-box-header wait-pay-box-body'>
                                <div className="product-detail-cart">
                                    <div className="product-image-cart">
                                        <img src='images/product.png' />
                                    </div>
                                    <div className="product-desc-cart">
                                        <h2>Scarlett</h2>
                                        <h3>Scarlett whitening glowing</h3>
                                    </div>
                                </div>
                                <div className="product-price-cart">
                                    <span>1x</span>
                                </div>
                                <div className="product-price-cart">
                                    <span>Rp.25000</span>
                                </div>
                                <div className='action-pesanan'>
                                    <div className='kurir-image' onClick={toggleKurir}>
                                        <img src='images/kurir-image.png' />
                                    </div>
                                    {isOpenKurir && (
                                        <div className='popup-checkout' onClick={toggleKurir}>
                                            <div className='kurir-image-popup'>
                                                <img src='images/kurir-image.png' />
                                            </div>
                                        </div>
                                    )}
                                    <div className='kurir-details'>
                                        <h3>Siti Aisyach</h3>
                                        <span>Z 1234 HJ</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {activeTab === 'Selesai' && 
                    <div className='wait-pay'>
                        <div className='wait-pay-header wait-pay-header-complete'>
                            <span>Pesanan Selesai</span>
                        </div>
                        <div className='wait-pay-box'>
                            <div className='wait-pay-box-header wait-pay-box-body'>
                                <div className="product-detail-cart">
                                    <div className="product-image-cart">
                                        <img src='images/product.png' />
                                    </div>
                                    <div className="product-desc-cart">
                                        <h2>Scarlett</h2>
                                        <h3>Scarlett whitening glowing</h3>
                                    </div>
                                </div>
                                <div className="product-price-cart">
                                    <span>1x</span>
                                </div>
                                <div className="product-price-cart">
                                    <span>Rp.25000</span>
                                </div>
                                <div className='action-pesanan'>
                                    <button className='pay-pesanan pay-pesanan-again'>Beli Lagi</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
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
