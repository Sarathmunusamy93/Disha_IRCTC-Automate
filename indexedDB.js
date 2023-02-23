var window = window ?? self;

// This works on all devices/browsers, and uses IndexedDBShim as a final fallback
var indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB,
  IDBTransaction =
    window.IDBTransaction ||
    window.webkitIDBTransaction ||
    window.msIDBTransaction;
// baseName = "TrackME",
// storeName = "TrackMEDB";

function logerr(err) {
  console.log(err);
}

function connectDB(baseName, storeName, f) {
  // Open (or create) the database
  var request = indexedDB.open(baseName, 2);
  request.onerror = logerr;
  request.onsuccess = function () {
    f(request.result);
  };
  request.onupgradeneeded = function (e) {
    //console.log("running onupgradeneeded");
    var Db = e.currentTarget.result; //var Db = e.target.result;

    //uncomment if we want to start clean
    //if(Db.objectStoreNames.contains(storeName)) Db.deleteObjectStore("note");

    //Create store
    if (!Db.objectStoreNames.contains(storeName)) {
      var store = Db.createObjectStore(storeName, {
        keyPath: "id",
        autoIncrement: true,
      });
      //store.createIndex("NameIndex", ["name.last", "name.first"], { unique: false });
    }
    connectDB(baseName, f);
  };
}

function get(baseName, storeName, id, f) {
  connectDB(baseName, storeName, function (db) {
    var transaction = db
      .transaction([storeName], "readonly")
      .objectStore(storeName)
      .get(id);
    transaction.onerror = logerr;
    transaction.onsuccess = function () {
      f(transaction.result ? transaction.result : -1);
    };
  });
}

function getAll(baseName, storeName, f) {
  connectDB(baseName, storeName, function (db) {
    var rows = [],
      store = db.transaction([storeName], "readonly").objectStore(storeName);

    if (store.mozGetAll)
      store.mozGetAll().onsuccess = function (e) {
        f(e.target.result);
      };
    else
      store.openCursor().onsuccess = function (e) {
        var cursor = e.target.result;
        if (cursor) {
          rows.push(cursor.value);
          cursor.continue();
        } else {
          f(rows);
        }
      };
  });
}

function deleteAll(baseName, storeName, f) {
  connectDB(baseName, storeName, function (db) {
    var store = db.transaction([storeName], "readwrite").objectStore(storeName);

    store.clear();
    f();
  });
}

function up(obj) {
  //obj with id
  del(obj.id, "up");
  add(obj, "up");
}

function add(baseName, storeName, obj, key, info, callback, isUpdate) {
  info = typeof info !== "undefined" ? false : true;
  connectDB(baseName, storeName, function (db) {
    var transaction = db.transaction([storeName], "readwrite");
    var objectStore = transaction.objectStore(storeName);

    if (isUpdate) {
      var request = objectStore.put(obj, key);

      request.onsuccess = function (e) {
     //   phodaDB.indexedDB.getAllEntries();
      };
      request.onerror = function (e) {
        console.log("Error adding: " + e);
      };
    } else {
      var objectStoreRequest = objectStore.add(obj, key);

      objectStoreRequest.onerror = logerr;
      objectStoreRequest.onsuccess = function () {
        if (info) {
          console.log("Rows has been added");
        } else {
          console.log("Rows has been updated");
        }
        console.info(objectStoreRequest.result);
        callback(objectStoreRequest.result, obj);
      };
    }
  });
}

function del(baseName, storeName, id, info, callback) {
  info = typeof info !== "undefined" ? false : true;
  connectDB(baseName, storeName, function (db) {
    var transaction = db.transaction([storeName], "readwrite");
    var objectStore = transaction.objectStore(storeName);
    var objectStoreRequest = objectStore.delete(id);
    objectStoreRequest.onerror = logerr;
    objectStoreRequest.onsuccess = function () {
      if (info) console.log("Rows has been deleted: ", id);
      callback();
    };
  });
}

function updateData(baseName, storeName, key, callback) {
  connectDB(baseName, storeName, function (db) {
    // const objectStore = db.transaction(baseName).objectStore(storeName);
    var transaction = db.transaction([storeName], "readwrite");
    var objectStore = transaction.objectStore(storeName);

    const request = objectStore.get(key);

    request.onsuccess = () => {
      const student = request.result;

      // // Change the name property
      // student.name = "Fulanito";

      // Create a request to update
      const updateRequest = objectStore.put(student, key);

      updateRequest.onsuccess = () => {
        console.log(`Estudent updated, email: ${updateRequest.result}`);
      };
    };
  });
}

// //add data
// add({ word: 'one', data: 100 });
// add({ word: 'two', data: 200 });
// add({ word: 'three', data: 300 });
// add({ word: 'seven', data: 700 });

// //edit data
// up({ word: 'five', data: 500, id: 1 });

// //delete
// del(3);

// //get data
// func = function (result) {
//     console.log(result);
// };
// get(1, func);
// getAll(func);
