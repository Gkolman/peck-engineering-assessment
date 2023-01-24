const { DataTypes } = require('sequelize');
/**
 * @description Defines the FoodTruck table.
 */
module.exports = (sequelizeConn) => {
  return sequelizeConn.define('FoodTruck', 
    {
      id: { type: DataTypes.STRING, allowNull: false, primaryKey: true},
      name: { type: DataTypes.STRING, allowNull: true },
      address: { type: DataTypes.STRING, allowNull: true },
      rating: { type: DataTypes.FLOAT, allowNull: false },
      reviews_count: { type: DataTypes.INTEGER, allowNull: false },
      food_items: { type: DataTypes.STRING(1234), allowNull: true },
      zip_code: { type: DataTypes.STRING, allowNull: true }
    },
    {
      timestamps: false
    }
  )
}
