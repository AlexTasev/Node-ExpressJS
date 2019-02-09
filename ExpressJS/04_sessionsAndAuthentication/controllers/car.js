const Car = require('../models/Car');
const Rent = require('../models/Rent');

module.exports = {
    addGet: (req, res) => {
        res.render('car/add');
    },
    addPost: (req, res) => {
        const carBody = req.body;
        carBody.pricePerDay = Number(carBody.pricePerDay);
        Car.create(carBody)
            .then(() => {
                res.redirect('/');
            })
            .catch(console.error)
    },
    allCars: (req, res) => {
        Car.find({ isRented: false })
            .then((cars) => {
                res.render('car/all', {
                    cars
                });
            }).catch(console.error);
    },
    rentGet: (req, res) => {
        const carId = req.params.id;
        Car.findById(carId)
            .then((car) => {
                res.render('car/rent', car)
            }).catch(console.error);
    },
    rentPost: (req, res) => {
        const car = req.params.id;
        const user = req.user._id;
        const days = Number(req.body.days);

        Rent.create({
                days,
                user,
                car
            })
            .then(() => {
                Car.findById(car)
                    .then((c) => {
                        c.isRented = true;
                        return c.save();
                    })
                    .then(() => {
                        res.redirect('/car/all');
                    })
            }).catch(console.error);
    }
}