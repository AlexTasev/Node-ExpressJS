const storage = require("./storage");

storage.put("first", "firstOne");
storage.put("second", "secondOne");

storage.update('second', 'someOne');
storage.update('nextOne', 'niceOne');

console.log(storage.getAll());

storage.update('nextOne', 'bestOne');
storage.del('first')

console.log(storage.getAll());

storage.put('anithing', 'anythingNew');
storage.save();
storage.load();
