const fs = require('fs');

let storage = {};

module.exports = {
    put: (key, value, callback) => {
        if (typeof key === 'string') {
            if (!storage.hasOwnProperty(key)) {
                storage[key] = value;
                callback(storage[key]);
            } else {
                throw new Error("The key already exists");
            }
        } else {
            throw new Error("The key should be string");
        }

    },

    get: (key, callback) => {
        if (typeof key === 'string') {
            if (storage.hasOwnProperty(key)) {
                callback(storage[key]);
            } else {
                throw new Error("The key does not exist!");
            }
        } else {
            throw new Error("The key should be string");
        }
    },

    getAll: (callback) => {
        const keys = Object.keys(storage);
        if (keys.length === 0) {
            throw new Error("The storage is empty")
        } else {
            keys.forEach(key => {
                console.log(`${key}:${storage[key]}`);
            });
            callback(storage);
        }
    },

    update: (key, newValue, callback) => {
        if (typeof key === 'string') {
            if (storage.hasOwnProperty) {
                storage[key] = newValue;
                callback(storage[key]);
            } else {
                throw new Error("The key does not exist!")
            }
        } else {
            throw new Error("The key should be string");
        }
    },

    del: (key, callback) => {
        if (typeof key === 'string') {
            if (storage.hasOwnProperty(key)) {
                delete storage[key];
                callback(storage);
            } else {
                throw new Error("The key does not exist!")
            }
        } else {
            throw new Error("The key is not string type");
        }
    },

    clear: (callback) => {
        storage = {};
        callback(storage);
    },

    save: (callback) => {
        fs.writeFile('storage.json', JSON.stringify(storage));
        callback('file is saved');
    },

    load: (callback) => {
        if (fs.existsSync('storage.json')) {
            let data = fs.readFile('storage.json');
            storage = JSON.parse(data);
            console.log('File is loaded');
            callback(storage);
        } else {
            ('We could not find your file "storage.json"')
        }
    }
};