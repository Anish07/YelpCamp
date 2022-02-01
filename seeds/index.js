const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
  }
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 1000; i++) {
        const random1000 = Math.floor(Math.random() * 2739);
        const price = Math.floor(Math.random() * 20) + 10;
        const descrip = sample(descriptors);
        const place = sample(places);
        const camp = new Campground({
            author: '61f890ef89ea6d2452c9f031',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${descrip} ${place}`,
            description: `Seek adventure at ${descrip} ${place}, where experiences engage you — from mountain biking through the woods, to camping along the riverside, to running in adventure races. Spend an afternoon, or a whole weekend!`,
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/anishsyelpcamp/image/upload/v1643511754/YelpCamp/dqr8zayrqtpe1urlumyo.jpg',
                    filename: 'YelpCamp/dqr8zayrqtpe1urlumyo'
                },
                {
                    url: 'https://res.cloudinary.com/anishsyelpcamp/image/upload/v1643511754/YelpCamp/olptmdisblccrqs5cp11.jpg',
                    filename: 'YelpCamp/olptmdisblccrqs5cp11'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})