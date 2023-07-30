const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Review', {
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    text: {
      type: DataTypes.TEXT
    },
    userId: {
      type: DataTypes.TEXT, // Asegúrate de que el tipo de datos sea UUID
      allowNull: false,
    },
  });
};