import axios from "axios";

const StripeButton = ({ cartItems }) => {
  const handledCheckout = () => {
    axios.post("http://localhost:3001/stripe/", {
      cartItems,
    })
    .then((response) => {
      console.log(response);
      if (response.data.url) {
        // Guardar el carrito de compras en el almacenamiento local antes de redirigir
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        window.location.href = response.data.url;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  };

  return (
    <>
      <button onClick={handledCheckout}>Check Out</button>
    </>
  );
};

export default StripeButton;
