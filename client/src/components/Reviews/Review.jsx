import React from "react";
import { Rating } from "@mui/material";

const Reviews = ({ reviews }) => {
  // Función para calcular el promedio de puntuaciones de las reviews
  const calculateAverageScore = () => {
    if (!reviews || reviews.length === 0) return 0;

    const totalScore = reviews.reduce((accumulator, review) => accumulator + review.score, 0);
    return totalScore / reviews.length;
  };

  return (
    <div>
      {reviews && reviews.length > 0 ? ( // Check if reviews is not undefined before accessing its length
        <>
          <div style={{ marginLeft: "10px", display: "inline-block", width: "20%" }}>
            <p>Promedio de puntuación:</p>
          </div>
          <div style={{ marginLeft: "30px", display: "inline-block", flexDirection: "column", width: "25%", flexWrap: "wrap", textAlign: "left", justifyContent: "center" }}>
            <Rating name="read-only" value={calculateAverageScore()} readOnly />
          </div>
        </>
      ) : (
        <p>No hay reseñas disponibles.</p>
      )}

      {reviews && reviews.map((review) => ( // Check if reviews is not undefined before mapping
        <div key={review.id} style={{ marginLeft: "10px", display: "inline-block", padding: "5px", wordWrap: "break-word", width: "100%", justifyContent: "center", alignItems: "center" }}>
          <p>{review.review}</p>
        </div>
      ))}
    </div>
  );
};

export default Reviews;