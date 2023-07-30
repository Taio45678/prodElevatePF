const {Product, Review, User} = require('../../../db');

async function getReview(productId, userId) {
    let product = await Product.findByPk(productId);
    if (!product) throw new Error('El producto no existe en la base de datos.');
    let user = await User.findByPk(userId);
    if (!user) throw new Error('El usuario no existe en la base de datos.');
    let where = {productId, userId};
    const review = await Review.findAll({where});
    return review;
}
module.exports = getReview;