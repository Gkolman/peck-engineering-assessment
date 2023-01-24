const { DataTypes, Sequelize } = require('sequelize');
/**
 * @description Defines the FoodTruck table.
 */
module.exports = (sequelizeConn) => {
  return sequelizeConn.define('Review', 
  {
    id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: { type: DataTypes.STRING, allowNull: false },
    rating: { type: DataTypes.STRING, allowNull: false },
    comment: { type: DataTypes.STRING(1234), allowNull: true },
    food_truck_id: { 
        type: DataTypes.STRING,
        references: {
            model: 'FoodTrucks', 
            key: 'id',
        },
        allowNull: false, 
        onDelete: 'CASCADE',
    },
  },
  {
    timestamps: true,
  })
}
