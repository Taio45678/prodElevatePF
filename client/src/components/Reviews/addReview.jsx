import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postReview } from "../../redux/actions/actions";
import {Box,Grid,Card,CardContent} from "@mui/material";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { getAuth, onAuthStateChanged } from "firebase/auth"; // Importa las funciones de autenticación de Firebase
const AddReviewForm = ({ productId }) => {
    const [input, setInput] = useState({
      userId: "", // Agrega el estado para almacenar el UID del usuario
      productId: productId,
      score: 0,
      title: "",
      text: "",
    });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const usuario = useSelector((state) => state.user); // Obtén el estado del usuario logueado desde Redux

  const dispatch = useDispatch();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };
  
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setInput((prevInput) => ({
          ...prevInput,
          userId: user.uid, // Asigna el uid del usuario como userId en el estado del formulario
        }));
      } else {
        setCurrentUser(null);
      }
    });
  
    // Limpia el listener al desmontar el componente para evitar fugas de memoria
    return () => unsubscribe();
  }, []);
    // Limpia el listener al desmontar el componente para evitar fugas de memoria
    
const handleReviewSubmit = async (reviewData) => {
    try {
      const user = currentUser;
      // Verificar si el usuario está autenticado
      if (!user) {
        console.error('Usuario no autenticado');
        return;
      }
  
      // Obtener el token de acceso del usuario logueado
      const token = await user.getIdToken();
  
      // Antes de guardar la reseña, asegúrate de transformar el UID de Firebase en un formato UUID válido
      const formattedUserId = user.uid.replace(/-/g, ''); // Elimina los guiones del UID
      reviewData.userId = formattedUserId; // Actualiza el campo userId en reviewData con el formato UUID
  
      // Llamar a la acción postReview y pasar el usuario logueado, el userId actualizado y el token de acceso
       dispatch(postReview(reviewData, user, formattedUserId, token));
  
      // ...
    } catch (error) {
      console.error('Error al enviar la review:', error);
      // Manejar el error si es necesario
    } finally {
      setLoading(false); // Oculta el estado de carga después de agregar la reseña, si estás usando este estado
    }
  };
      function validate(input) {
        let errors = {};
    
        if (!input.title) {
          errors.title = "Ingresa un título.";
        }
        if (!input.score) {
          errors.score = "Ingresa una puntuación.";
        }
        if (!input.text) {
          errors.text = "Ingresa una reseña.";
        }
        return errors;
      }
    
      const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true); // Muestra el estado de carga mientras se verifica la autenticación
      
        // Verifica si el usuario está logueado con Firebase
        const user = currentUser;
        if (!user) {
          // Si no está logueado, muestra un mensaje o realiza alguna acción
          alert("Debes estar logueado para agregar una reseña");
          setLoading(false);
          return;
        }
      
        // Si el usuario está logueado, procede con el envío de la reseña
        const validationErrors = validate(input);
        setErrors(validationErrors);
      
        if (Object.keys(validationErrors).length === 0) {
          handleReviewSubmit(input);
        } else {
          setLoading(false); // Oculta el estado de carga si hay errores de validación
        }
      };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box sx={{ "& .MuiTextField-root": { m: 1, width: "60ch" }, width: "62ch", my: "2%", mx: "30%", maxWidth: "100%", bgcolor: "white", borderRadius: "10px" }}>
          <Box component="form" sx={{ "& .MuiTextField-root": { m: 1, width: "60ch" }, maxWidth: "100%", bgcolor: "white", borderRadius: "10px" }} noValidate autoComplete="off">
            <div>
            <Rating
                    defaultValue={2.5}
                    precision={0.5}
                    size="large"
                    label="Puntuación:" // Usar la prop "label" en lugar de "InputLabelProps"
                    name="score"
                    value={input.score}
                    onChange={(event, newValue) => {
                        setInput((prevInput) => ({
                        ...prevInput,
                        score: newValue,
                        }));
                    }}
                    />
              {errors.score && <p>{errors.score}</p>}
            </div>
            <div>
              <TextField id="standard-basic" label="Título" variant="standard" htmlFor="title" value={input.title} name="title" onChange={handleInputChange} InputLabelProps={{ shrink: true }} />
              {errors.title && <p>{errors.title}</p>}
            </div>
            <div>
              <TextField id="standard-basic" variant="standard" label="Reseña:" htmlFor="text" value={input.text} onChange={handleInputChange} name="text" InputLabelProps={{ shrink: true }} />
              {errors.text && <p>{errors.text}</p>}
            </div>
          </Box>
        </Box>
        <Button type="submit">Agregar Reseña</Button>
      </form>
    </div>
  );
};

export default AddReviewForm;
