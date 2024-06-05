import { useAuth } from '@/contexts/AuthContext';
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { MdHistory } from "react-icons/md";
import { GoHistory } from "react-icons/go";
import { useRouter } from 'next/router';
import { useState } from 'react';
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useEffect } from 'react';
import { BiSolidDiscount } from "react-icons/bi";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  console.log(user)
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!user) {
    return <div>Anda harus masuk untuk melihat halaman ini.</div>;
  }

  const [activeTab, setActiveTab] = useState('tab1');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [vouchers, setVouchers] = useState([]);
  const [filteredVouchers, setFilteredVouchers] = useState([]);

    useEffect(() => {
        const fetchVoucher = async () => {
            try {
                const response = await fetch(`${baseUrl}/voucher`);
                const data = await response.json();
                const today = new Date();
                const filteredVouchers = data.data.filter(voucher => {
                    const expDate = new Date(voucher.exp_date);
                    return expDate > today && voucher.qty > 0; // Filter voucher yang belum kedaluwarsa dan qty lebih dari 0
                });
                setVouchers(filteredVouchers);
            } catch (error) {
                console.error('Error fetching vouchers:', error);
            }
        };
    
        fetchVoucher();
    }, []);

    const filterVouchers = () => {
      const lowerCaseSearch = search.toLowerCase();
      const filtered = vouchers.filter(voucher => 
        voucher.type === "public" || 
        (voucher.type === "private" && voucher.code.toLowerCase() === lowerCaseSearch)
      );
      setFilteredVouchers(filtered);
    };
    
    
    const handleVoucherSelect = (voucher) => {
      setSelectedVoucher(voucher);
    };

    const calculateDaysLeft = (expDateStr) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Menghilangkan waktu dari tanggal saat ini
      const expDate = new Date(expDateStr);
      expDate.setHours(0, 0, 0, 0); // Menghilangkan waktu dari tanggal kedaluwarsa
      const timeDiff = expDate - today;
      return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Menghitung dan mengembalikan selisih hari
    };

  return (
    <div className='profile-page'>
      <div className="menu-popup-mobile menu-popup-mobile-template">
        <span className="close"><HiOutlineArrowLeft onClick={() => router.back()} /> Profil Kamu</span>
      </div>
      <div className='profile-page-content'>
        <div className='profile-page-info'>
          <div className='profile-page-image'>
            <img src={`https://api.upos-conn.com/master/v1/${user.image}`}/> 
          </div>
          <button>Member Silver</button>
          <h1>{user.nama}</h1>
          <span>{user.email}</span>
        </div>
        <div className='tab-profile-page'>
          <button 
            className={activeTab === 'tab1' ? 'active' : ''} 
            onClick={() => handleTabClick('tab1')}
          >
            Voucher
          </button>
          <button 
            className={activeTab === 'tab2' ? 'active' : ''} 
            onClick={() => handleTabClick('tab2')}
          >
            Member
          </button>
          <button className={activeTab === 'tab3' ? 'active' : ''} onClick={() => handleTabClick('tab3')}>
            <GoHistory />
          </button>
        </div>
        <div className='buy-total-profile'>
          <span>Total belanja :</span>
          <h1>Rp. 140.000</h1>
        </div>
        <div className='tab-content-profile-page'>
          {activeTab === 'tab1' && 
            
              <div className='voucher-profile'>
                {vouchers.map(voucher => {
                  const daysLeft = calculateDaysLeft(voucher.exp_date);
                  return (
                      <div className='voucher-profile-box'>
                           <div className="voucher-box-image">
                              <img src={`https://prahwa.net/storage/${voucher.image}`} />
                              <div className="circle-left circle-left-profil"></div>
                              <div className="circle-right circle-right-profil"></div>
                          </div>
                          <div className="voucher-box-content voucher-box-content-profil">
                              <h5><BiSolidDiscount /> Diskon Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(voucher.min_spend)},-</h5>
                              {daysLeft >= 0 ? (
                                  <p>Berakhir dalam {daysLeft} hari</p>
                              ) : (
                                  <p>Kedaluwarsa</p>
                              )}
                          </div>
                      </div>
                  );
                })}
              </div>
              
          }
          {activeTab === 'tab2' && 
            <div className='tier-body-box'>
              <div className='tier-body-content'>
                <div className='tier-body-header'>
                  <div className='tier-body-image'>
                    <img src={`https://api.upos-conn.com/master/v1/${user.image}`}/> 
                  </div>
                  <div className='tier-body-header-content'>
                    <h1>{user.nama}</h1>
                    <button>Member Silver</button>
                  </div>
                </div>
                <div className='tier-body-main'>
                  <div className='tier-body-layout'>
                    <span>Tier</span>
                    <h3>Member <br/>Silver</h3>
                  </div>
                  <div className='tier-body-layout'>
                    <span>Poin Kamu</span>
                    <div className='process-layout'>
                      <h2>0<p>point</p></h2>
                      <input type="range" className='custom-range'/>
                      <h4>48 lagi untuk tier berikutnya</h4>
                    </div>
                  </div>
                </div>
                <div className='tier-body-footer'>
                  <div className='process-layout'>
                      <h2>0<p>point</p></h2>
                  </div>
                  <div className='tier-body-footer-content'>
                    <p>Dibutuhkan untuk level gold dan dapatkan keuntungan lainnya.</p>
                  </div>
                </div>
              </div>
            </div>
          }
          {activeTab === 'tab3' && <div>Konten Tab 3</div>}
        </div>
        {/* <p>Username: {user.nama}</p>
        <p>Email: {user.email}</p>
        <p>Nomor Telepon: {user.noTelp}</p>
        <p>Id: {user.posLoginId}</p> */}

        <button className='logout-btn' onClick={logout}><RiLogoutBoxRLine/>Keluar Akun</button>
      </div>
    </div>
  );
};

export default ProfilePage;
