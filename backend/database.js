const { Sequelize } = require('sequelize');
const { FoodTruckModel, ReviewModel } = require('./models')
const utils = require ('./utils')
const axios = require('axios')

require('dotenv').config();
const sequelizeConn = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql', 
    logging: false,
    port: process.env.MYSQL_PORT
  }
);

const connect = (async () => {
  try {
    await sequelizeConn.authenticate();
    console.log('sequelize connection has been established.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})()

const initDb = (async () => {
  try {
    await sequelizeConn.sync()
    await FoodTruckModel(sequelizeConn).sync();
    await ReviewModel(sequelizeConn).sync();
    const foodTruck = await sequelizeConn.models.FoodTruck.findOne()
    if (!foodTruck) {
      await seedDb()
    }
  } catch(error) {
    console.error("error initializing database", error)
  }
})()

const seedDb = async () => {
  const { data } = await axios.get('https://data.sfgov.org/api/views/rqzj-sfat/rows.JSON')
  data.data.forEach(async (foodTruck) => {
    const [ 
      sid, id, position, created_at, created_meta, updated_at, updated_meta, meta, locationid,
      applicant, FacilityType, cnn, LocationDescription, address, blocklot, block, lot,
      permit, Status, foodItems, X, Y, latitude, longitude, Schedule, dayshours, NOISent,
      Approved, Received, PriorPermit, ExpirationDate, Location, FirePreventionDistricts,
      PoliceDistricts, SupervisorDistricts, zipCodes, NeighborhoodsOld,
    ] = foodTruck
    try {
      const {totalRating, createdReviews} = utils.createReviews(id)
      await sequelizeConn.models.FoodTruck.create({
        id: id,
        name: applicant ? applicant.toLowerCase(): '',
        address: address ? address.toLowerCase(): '',
        rating: totalRating,
        reviews_count: createdReviews.length,
        food_items: foodItems ? foodItems.toLowerCase(): '',
        zip_code: zipCodes
      })
      await sequelizeConn.models.Review.bulkCreate(createdReviews)
    } catch (error) {
      console.error("error saving to db", error)
    }
  })
}
module.exports = { sequelizeConn }