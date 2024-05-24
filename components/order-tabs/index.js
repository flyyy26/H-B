import { useState } from 'react';

const OrderTabs = ({ setActiveTabProp }) => {
  const [activeTab, setActiveTab] = useState('Semua');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setActiveTabProp(tab); // Menyesuaikan nama prop agar tidak tumpang tindih
  };

  return (
    <div className="order-tabs">
      <div className={activeTab === 'Semua' ? 'tab active-tab' : 'tab'} onClick={() => handleTabClick('Semua')}>
        Semua
      </div>
      <div className={activeTab === 'Sedang Dikemas' ? 'tab active-tab' : 'tab'} onClick={() => handleTabClick('Sedang Dikemas')}>
        Sedang Dikemas
      </div>
      <div className={activeTab === 'Sedang Dikirim' ? 'tab active-tab' : 'tab'} onClick={() => handleTabClick('Sedang Dikirim')}>
        Sedang Dikirim
      </div>
      <div className={activeTab === 'Selesai' ? 'tab active-tab' : 'tab'} onClick={() => handleTabClick('Selesai')}>
        Selesai
      </div>
    </div>
  );
};

export default OrderTabs;
