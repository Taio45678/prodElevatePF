const { Favorite } = require("../../db");

const postFavorite = async (req, res) => {
  console.log(req.body);
  const { id, name, description, salePrice, images, stock, isActive, user } =
    req.body;
  

  try {
    // Verificar si ya existe un favorito con el mismo id
    const existingFavorite = await Favorite.findOne({ where: { id } });

    if (existingFavorite) {
      // Si existe, actualiza el favorito existente
      await existingFavorite.update({
        name,
        description,
        salePrice,
        images,
        stock,
        isActive,
      });

      await existingFavorite.addUser(user);

      const allFav = await Favorite.findAll();
      return res.status(201).json(allFav);
    } else {
      // Si no existe, crea un nuevo favorito
      const favorite = await Favorite.create({
        id,
        name,
        description,
        salePrice,
        images,
        stock,
        isActive,
      });

      await favorite.addUser(user);

      const allFav = await Favorite.findAll();
      return res.status(201).json(allFav);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ err: error.message });
  }
};

module.exports = { postFavorite };
