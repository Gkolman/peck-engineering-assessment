const { ReviewModel } = require('../models')
const utils = require ('../utils')

module.exports = {
  getReviewsForTruck: async (truckId, sequelizeConn) => {
    const reviewModel = sequelizeConn.models.Review
    const reviews =  await reviewModel.findAll({
      attributes: ['username', 'comment', 'rating'],
      where: {food_truck_id: truckId}
    })
    return reviews.map(review => review.dataValues )
  },
  getReviewsForTruckList: async (foodTrucks, sequelizeConn) => {
    const foodTruckIndex = foodTrucks.reduce((index, foodTruck) => {
      const { dataValues } = foodTruck
      index[dataValues.id] = dataValues
      delete index[dataValues.id].id
      return index
    }, {})
    const reviewModel = sequelizeConn.models.Review
    const reviews = await reviewModel.findAll({
      attributes: ['username', 'comment', 'rating', 'food_truck_id'],
      where: {food_truck_id: Object.keys(foodTruckIndex)}
    })
    return utils.aggregateFoodTruckReviews(foodTruckIndex, reviews)
  },
}
