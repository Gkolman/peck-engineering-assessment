const { loremIpsum } = require("lorem-ipsum");
const randomName = require('random-name')
let foodTruckTreeConstructed = false
let foodTruckTree;

/**
 * @class A tree structure constructed from each food item in every food truck's
 * @property {String} food_items list.
 */
class FoodTree {
  constructor(truckId, parent = null) {
    this.parent = parent
		this.ids = parent ? new Set([truckId]) : new Set()
    this.children = {}
  }
  /**
   * @param {String} food keyword or substring.
   * @return {Array} food truck ID's containing the food key word.
   */
  getTrucksIdsWithFood(food) {
    food = food.toLowerCase()
    let result = []
    let pointer = this
    let letterIndex = 0
    if (!pointer.children[food[letterIndex]]) { return result }
    while (pointer.children[food[letterIndex]]) {
      pointer = pointer.children[food[letterIndex]]
      letterIndex++
    }
    if (letterIndex <= food.length -1) { return [] }
    pointer.ids.forEach((value) => {result.push(value)})
    return result
  }
  /**
   * @description Takes a @foodItem and a @foodTruckId then adds the food
   * item to the tree and associates a food truck with that food item.
   * @param {String} foodItem in a trucks food_items list.
   * @param {String} foodTruckId
   */
  addFoodToTruck(foodItem, foodTruckId) {
    for (var letter of foodItem) {
      letter = letter.toLowerCase()
      let letterIndex = 0
      let pointer = this
      while (pointer.children[foodItem[letterIndex]]) {
          pointer = pointer.children[foodItem[letterIndex]]
          pointer.ids.add(foodTruckId)
          letterIndex++
      }
      while (letterIndex < foodItem.length) {
          let foodTree = new FoodTree(foodTruckId, pointer)
          pointer.children[foodItem[letterIndex]] = foodTree
          pointer = foodTree
          letterIndex++
      }
    }
  }
}

/**
 * @class A tree structure containing all of the food trucks and their 
 * respective food items.
 * @property {Class} foodBank A @FoodTree instance.
 * @property {Object} foodTrucks where each key is a food truck ID
 * and the value is the hash containing the properties of the food truck.
 */
class FoodTruckTree {
  constructor(foodTrucks) {
		this.foodTrucks = {}
		this.foodBank = new FoodTree()
    foodTrucks.forEach((foodTruck) => {
      const { dataValues } = foodTruck
      this.addFoodTruck(dataValues)
    })
	}
  /**
   * @param {String} food a food keyword or even just a substring.
   * @return {Array} All food trucks that contain the food substring within
   *  their @property {Array} food_items field.
   */
  getFoodTrucksWithFood(food) {
    let foodTruckIds = this.foodBank.getTrucksIdsWithFood(food)
    return foodTruckIds.map((foodTruckId) => {
      let foodTruck = this.foodTrucks[foodTruckId]
      return {
        "name": foodTruck.name,
        "address": foodTruck.address,
        "rating" : foodTruck.rating,
        "food_items" : foodTruck.food_items,
        "reviews_count" : foodTruck.reviews_count,
        "zip_code" : foodTruck.zip_code,
        "id" : foodTruck.id,
      }
    })
  }
  /**
   * @description Adds a @foodTruck to the tree as well as the respective food_items.
   * @param {Object} foodTruck.
   */
  addFoodTruck(foodTruck) {
    const foodItems = foodTruck['food_items'] ? foodTruck['food_items'].split(" ") : []
    foodItems.forEach((foodItem) => {
      this.foodBank.addFoodToTruck(foodItem.toLowerCase(), foodTruck.id)
    })
		this.foodTrucks[foodTruck.id] = foodTruck
	}
}
/**
 * @description Generates a random number between the min and max range.
 */
const genNumberInRange =  (min, max) => {
  return (Math.floor(Math.random() * max) + min) 
}
/**
 * @description Generates a random comment for mock reviews.
 */
const genComment = () => {
  return loremIpsum()
}
/**
 * @description Generates a random name for mock reviews.
 */
const genName = () => {
  return `${randomName.first()} ${randomName.last()}`
}
/**
 * @description Rounds a number to the nearest decimal point.
 */
const round = (num) => {
  return Math.round(num * 10) / 10
}
/**
 * @description Takes a truck ID and returns a random .
 * @return {hash} 
 *    @property {Integer} totalRating of the food truck.
 *    @property {Array} createdReviews for the food truck.
 */
const createReviews = (truckId) => {
  let totalRating = 0
  const totalReviews = []
  for (var i = 0; i < genNumberInRange(1,4); i++) {
    const rating = genNumberInRange(1,5)
    totalRating += rating
    totalReviews.push({
      food_truck_id: truckId,
      username: genName(),
      comment: genComment(),
      rating: rating.toString(),
    })
  }
  const finalRating = round(totalRating / totalReviews.length)
  return {totalRating : finalRating, createdReviews: totalReviews }
}
/**
 * @param {Object} foodTruckIndex where each key is a food truck ID
 * and the value is the hash containing the properties of the food truck.
 * @param {Array} reviews collected for every food truck in the foodTruckIndex.
 * @return {Array} containing each food truck with their respective reviews
 */
const aggregateFoodTruckReviews = (foodTruckIndex, reviews) => {
  reviews.forEach((review) => {
    const { dataValues } = review
    const reviewData = {
      username: dataValues.username,
      rating: dataValues.rating,
      comment: dataValues.comment,
    }
    if (foodTruckIndex[dataValues['food_truck_id']].reviews) {
      foodTruckIndex[dataValues['food_truck_id']].reviews.push(reviewData)
    } else {
      foodTruckIndex[dataValues['food_truck_id']].reviews = [reviewData]
    }
  })
  return Object.values(foodTruckIndex)
}
/**
 * @description Creates a FoodTruckTree if one has not been created yet and
 * stores it in memory.
 * @return {Class} returns a created FoodTruckTree or the one stored in memory.
 */
const getFoodTruckTree = async (sequelizeConn) => {
  if (!foodTruckTreeConstructed) {
    foodTruckTree = new FoodTruckTree(
      await sequelizeConn.models.FoodTruck.findAll()
    )
  }
  foodTruckTreeConstructed = true
  return foodTruckTree
}

module.exports = {
  genNumberInRange,
  genComment,
  genName,
  getFoodTruckTree,
  aggregateFoodTruckReviews,
  createReviews,
}