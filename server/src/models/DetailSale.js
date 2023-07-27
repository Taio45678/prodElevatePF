const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('DetailSale', {
        Detail_id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true  
        },
        Sales_Quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      });
      }