import {
  SHOW_PRODUCTS,
  GET_PRODUCT_NAME,
  GET_PRODUCT_DETAIL,
  ADD_PRODUCT,
  ADD_CATEGORY,
  ADD_PROVIDER,
  GET_CATEGORY,
  ADD_ROLE,
  ADD_USER,
  GET_PROVIDER,
  LOGIN,
  ADD_TO_CART,
  CALCULE_TOTALS,
  REMOVE_TO_CART,
  DECREMENT_CART,
  INCREMENT_CART,
  CLEAR_CART,
  GET_PRODUCT_ID,
  EDIT_PRODUCT,
  GET_USER_REVIEWS,
  GET_ALL_REVIEWS,
  ADD_REVIEW,
} from "./types";
import axios from "axios";
import { ENDPOINT } from "../../components/endpoint/ENDPOINT";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

export const showProducts = () => {
  try {
    return async (dispatch) => {
      const { data } = await axios.get(`${ENDPOINT}product`);
      console.log(data);
      return dispatch({ type: SHOW_PRODUCTS, payload: data });
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getProductName = (name) => {
  return { type: GET_PRODUCT_NAME, payload: name };
};

export const getProductDetail = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${ENDPOINT}productid/${id}`);
      console.log(response.data);
      dispatch({ type: GET_PRODUCT_DETAIL, payload: response.data });
      dispatch(getProductReviews(id));
    } catch (error) {
      throw new Error("Error fetching product details: " + error.message);
    }
  };
};

export const addProduct = (product) => {
  return async (dispatch) => {
    try {
      await axios.post(`${ENDPOINT}product`, product);
      return dispatch({ type: ADD_PRODUCT, payload: product });
    } catch (error) {
      return error.message;
    }
  };
};

export const editProduct = (productId, changeProduct) => {
  console.log("1: ", changeProduct);
  console.log("2: ", productId);
  return async (dispatch) => {
    try {
      await axios.put(`${ENDPOINT}product/${productId}`, changeProduct);
      return dispatch({
        type: EDIT_PRODUCT,
        payload: { productId, changeProduct },
      });
    } catch (error) {
      return error.message;
    }
  };
};
export const addCategory = (category) => {
  return async (dispatch) => {
    try {
      await axios.post(`${ENDPOINT}category`, category);
      return dispatch({ type: ADD_CATEGORY, payload: category });
    } catch (error) {
      return error.message;
    }
  };
};

export const getCategory = () => {
  try {
    return async (dispatch) => {
      await axios.get(`${ENDPOINT}category`).then((response) => {
        if (!response.data) throw Error("¡The category does not exist!");
        return dispatch({ type: GET_CATEGORY, payload: response.data });
      });
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const addProvider = (provider) => {
  return async (dispatch) => {
    try {
      await axios.post(`${ENDPOINT}provider`, provider);
      return dispatch({ type: ADD_PROVIDER, payload: provider });
    } catch (error) {
      return error.message;
    }
  };
};

export const addRole = (role) => {
  return async (dispatch) => {
    try {
      await axios.post(`${ENDPOINT}role`, role);
      return dispatch({ type: ADD_ROLE, payload: role });
    } catch (error) {
      return error.message;
    }
  };
};

export const addUser = (user) => {
  return async (dispatch) => {
    try {
      await axios.post(`${ENDPOINT}user`, user);
      return dispatch({ type: ADD_USER, payload: user });
    } catch (error) {
      return error.message;
    }
  };
};

export const getProvider = () => {
  try {
    return async (dispatch) => {
      await axios.get(`${ENDPOINT}provider`).then((response) => {
        if (!response.data) throw Error("¡The provider does not exist!");
        return dispatch({ type: GET_PROVIDER, payload: response.data });
      });
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const login = (userData) => {
  try {
    return async (dispatch) => {
      const response = await axios.post(`${ENDPOINT}login`, userData);
      if (response.data) {
        const user = response.data;
        return dispatch({ type: LOGIN, payload: user.User });
      }
      throw new Error("Credenciales inválidas");
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logout = () => {
  try {
    return async (dispatch) => {
      sessionStorage.removeItem("user"); // Eliminar la información del usuario del sessionStorage
      return dispatch({ type: LOGIN, payload: null });
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

//Cart

export const calculateTotals = () => {
  return {
    type: CALCULE_TOTALS,
  };
};

export const removeToCart = (product) => {
  return function (dispatch) {
    dispatch({
      type: REMOVE_TO_CART,
      payload: product,
    });
    toast.error(`${product.name} remove from de cart`, {
      position: "bottom-left",
    });

    return {
      type: REMOVE_TO_CART,
      payload: product,
    };
  };
};

export const addToCart = (product) => {
  return function (dispatch) {
    if (product.stock > 0) { // Utilizamos 'minStock' en lugar de 'stock' para verificar si hay existencias
      dispatch({
        type: ADD_TO_CART,
        payload: product,
      });
      toast.success(`${product.name} added to cart`, {
        position: "bottom-left",
      });
    } else {
      toast.error("Out of stock", {
        position: "bottom-left",
      });
    }
  };
};

export const decrementToCart = (product) => {
  return function (dispatch) {
    dispatch({
      type: DECREMENT_CART,
      payload: product,
    });
    toast.info(` Decrement ${product.name} cart quantity`, {
      position: "bottom-left",
    });

    return {
      type: DECREMENT_CART,
      payload: product,
    };
  };
};

export const incrementToCart = (product) => {
  return {
    type: INCREMENT_CART,
    payload: product,
  };
};
export const clearCart = () => {
  return function (dispatch) {
    dispatch({
      type: CLEAR_CART,
    });
    toast.error(`The cart is clear`, {
      position: "bottom-left",
    });

    return {
      type: CLEAR_CART,
    };
  };
};
//Reviews
export const postReview = (reviewData) => {
  return async function (dispatch) {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      // Verificar si el usuario está autenticado
      if (!user) {
        console.error('Usuario no autenticado');
        throw new Error('Usuario no autenticado'); // Lanza una excepción para que puedas capturarla en el componente
      }

      // Obtener el token de acceso del usuario logueado
      const token = await user.getIdToken();

      // Obtener el userId del usuario logueado desde el objeto currentUser de Firebase
      const userId = user.uid; // Asegúrate de que la propiedad correcta sea 'uid', ajusta esto si es diferente

      // Llamar a la acción postReview y pasar el usuario logueado, el userId y el token de acceso
      const response = await axios.post(`${ENDPOINT}reviews/Create`, reviewData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error en la acción postReview:', error);
      throw new Error('Error al crear la reseña');
    }
  };
};
export const getProductReviews = (id) => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${ENDPOINT}reviews/product/${id}`);
      return dispatch({ type: GET_ALL_REVIEWS, payload: response.data });
    } catch (error) {
      console.error('Error al obtener las reseñas del producto:', error);
      // Manejar el error si es necesario
    }
  };
};

export const getUserReviews = (id) => {
  return async function (dispatch) {
      var json = await axios.get(`${ENDPOINT}reviews/user/${id}`)
      return dispatch({
          type: GET_USER_REVIEWS,
          payload: json.data
      })
  }
}