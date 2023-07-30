const { Product, Review, User } = require('../../../db');
const sequelize = require('sequelize');
async function createReview(productId, userId, reviewData) {
    const { score, title, text } = reviewData;
  
    // Verificar si el producto existe en la base de datos
    let product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('El producto no existe en la base de datos.');
    }
  
    // Verificar si los datos de la reseña están completos
    if (!(score && title)) {
      throw new Error('Falta enviar datos obligatorios de la reseña');
    }
  
    // Crear la reseña y asociarla al producto y al usuario
    const newReview = await Review.create({ score, title, text, userId });
    product.addReview(newReview);
  
    return newReview;
  }
module.exports = createReview;