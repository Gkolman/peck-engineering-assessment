const { Op, Sequelize} = require('sequelize');
const Reviews = require('./reviews')
const utils = require('../utils')

module.exports = {
  getWithId: async (request, response, sequelizeConn) => {
    const foodTruckId = request.params.id
    const { FoodTruck: foodTruckModel } = sequelizeConn.models
    try {
      const {dataValues: foodTruck} = await foodTruckModel.findOne({ where: { id: foodTruckId }});
      const reviews = await Reviews.getReviewsForTruck(foodTruckId, sequelizeConn)
      response.send({
        ...foodTruck,
        reviews,
      })
    } catch (error) { 
      response.send(error.message)
    } 
  },
  getList: async (request, response, sequelizeConn) => {
    let { reviews, topRated, limit, offset } = request.query
    offset = offset ? parseInt(offset) : 0
    limit = limit ? parseInt(limit) + offset : 10
    const foodTrucksModel = sequelizeConn.models.FoodTruck
    try {
      let foodTrucks = await foodTrucksModel.findAll({
        order: topRated ? [ ['rating', 'DESC'] ] : [],
        offset: offset || 0, 
        limit: limit || 10 
      });
      if (reviews) {
        foodTrucks = await Reviews.getReviewsForTruckList(foodTrucks, sequelizeConn)
        response.send(foodTrucks)
      } else {
        response.send(foodTrucks)
      }
    } catch (error) { 
      response.send(error.message)
    } 
  },
  getWithKeyWord: async (request, response, sequelizeConn) => {
    let { reviews, topRated, keyword, limit, offset } = request.query
    offset = offset ? parseInt(offset) : 0
    limit = limit ? parseInt(limit) + offset : 10
    if (!keyword) { response.send("please provide a type of food you are looking for") }
    let foodTruckTree = await utils.getFoodTruckTree(sequelizeConn)
    try {
      let foodTrucks = foodTruckTree.getFoodTrucksWithFood(keyword)
      if (topRated) {
        foodTrucks = foodTrucks.sort((a,b) => { return b.rating - a.rating} )
      }
      foodTrucks = foodTrucks.slice(offset, limit)
      if (reviews) {
        foodTrucks = await Reviews.getReviewsForTruckList(foodTrucks, sequelizeConn)
        response.send(foodTrucks)
      } else {
        response.send(foodTrucks)
      }
    } catch (error) { 
      response.send(error.message)
    } 
  },
}
