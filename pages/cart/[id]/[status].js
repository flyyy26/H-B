// pages/cart/[id]/[status].js

import { useRouter } from 'next/router';
import CartComponent from '@/components/cart';

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
      <CartComponent id={id} status={status} />
    </div>
  );
};

export default CartPage;
