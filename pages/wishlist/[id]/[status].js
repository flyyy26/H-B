// pages/cart/[id]/[status].js

import { useRouter } from 'next/router';
import FavoritComponent from '@/components/favorit';

const CartPage = () => {
  const router = useRouter();
  const { id, status } = router.query;

  if (!id || !status) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <FavoritComponent id={id} status={status} />
    </div>
  );
};

export default CartPage;
