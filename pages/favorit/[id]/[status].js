// pages/cart/[id]/[status].js

import { useRouter } from 'next/router';
import FavoritComponent from '@/components/favorit';

const CartPage = () => {
  const router = useRouter();
  const { id, status } = router.query;

  if (!id || !status) {
    return (
      <div className='login-first-layout'>
        <img src="/images/tunggu-sebentar.png" alt='Loading' className='login-first'/>
      </div>
    );
  }

  return (
    <div>
      <FavoritComponent id={id} status={status} />
    </div>
  );
};

export default CartPage;
