// pages/cart/[id]/[status].js

import { useRouter } from 'next/router';
import CartComponent from '@/components/cart';

const CartPage = () => {
  const router = useRouter();
  const { id, status } = router.query;

  if (!id || !status) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <CartComponent id={id} status={status} />
    </div>
  );
};

export default CartPage;
