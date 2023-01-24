# peck-engineering-assessment
- ### Getting started
  - First clone down the repo using `git clone`.
  - If you do not have npm installed you will need to install it. Directions can be found [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
  - Download Docker [here](https://www.docker.com/products/docker-desktop/).
  - cd into the cloned repository directory and run `npm install` in your terminal.
- ### Docker incoming!
  - In the directory run `npm run docker:start` this will download the node and Mysql images then build the containers so this may take a couple minutes.
  - Once finished open a seperate terminal.
    - You can now ssh into the containers database by running `npm run db:connect`.
    - You can also ssh into the node application by running `npm run docker:connect` and type `ls` to see the application contents.

- ### The API
  - The server will be running on port 3000.
  - I reccomend using Postman for these request which can be downloaded [here](https://www.postman.com/downloads/).
  
- #### Endpoints
  - ##### GET localhost:3000/food/trucks/foodTruckId
    - returns the food truck and the reviews associated with it.
    - example: `localhost:3000/food/trucks/00000000-0000-0000-FD43-51856B90CD28`
  
  - ##### GET localhost:3000/food/trucks
    - query params
      - `topRated` Boolean determining if you would like to filter the food trucks based on their rating in descending order.
      - `reviews` Boolean determining if you would like to view the user written reviews for the food truck.
      - `limit` Number to limit the amount of food trucks to return. Defaults to 10
      - `offset` Number to offset the list of returned food trucks list typically for pages in a UI. Defaults to 0
     - example: `localhost:3000/food/trucks?reviews=true&topRated=true&offset=10&limit=20`

  - #### GET localhost:3000/food
    - query params
      - `keyword` String or substring to search through the food trucks `food item` list look for exactly what you want to eat. Try taco.
      - `topRated` Boolean determining if you would like to filter the food trucks based on their rating in descending order.
      - `reviews` Boolean determining if you would like to view the user written reviews for the food truck.
      - `limit` Number to limit the amount of food trucks to return. Defaults to 10.
      - `offset` Number to offset the list of returned food trucks list typically for pages in a UI. Defaults to 0.
     - example: `localhost:3000/food/?reviews=true&keyword=taco&topRated=true`
