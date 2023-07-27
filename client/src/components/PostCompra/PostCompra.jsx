import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart,calculateTotals, } from "../../redux/actions/actions";
import { useEffect } from "react";

const PostCompra = () => {
  const { cartItems, cartTotalAmount } = useSelector((state) => state);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems]);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div>
      <h2>Thank you for your purchase!</h2>
      <h3>Total Amount: ${cartTotalAmount}</h3>
      <h4>Items Purchased:</h4>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            <div>
              <h3>{item.name}</h3>
              <img src={item.images} alt={item.name} />
              <p>Price: ${item.salePrice}</p>
              <p>Quantity: {item.cartQuantity}</p>
              <p>Total: ${item.salePrice * item.cartQuantity}</p>
          
            </div>
          </li>
        ))}
      </ul>
      <button onClick={handleClearCart}>Clear Cart</button>
    </div>
  );
};

export default PostCompra;