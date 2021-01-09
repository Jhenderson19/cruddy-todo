const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId( (error, id) => {
    if (error) {
      console.log('error -> ', error);
    }
    console.log('id -> ', id);

    items[id] = text;
    callback(null, { id, text });

    fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
      if (error) {
        console.log('error =>', error);
      } else {
        console.log('success writing ', text, ' to file');
      }
    });
  });

};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   console.log('items - > ', items);
  //   return { id, text };
  // });
  var data = [];
  // fs.readdir( exports.dataDir, (err, files) => {
  //   if (err) {
  //     console.log('error -> ', error);
  //   } else {
  //     files.forEach(file => {
  //       console.log('file -> ', file, 'typeof file', typeof file);
  //       // read file here
  //       data.push({ id: file.slice(0, file.length - 4), text: file.toString()});
  //     });
  //     callback(null, data);
  //   }
  // });

  var getFiles = () => {
    return new Promise( (resolve, reject ) => {
      fs.readdir( exports.dataDir, (err, files) => {
        if (err) {
          console.log('error -> ', error);
          reject(error);
        } else {
          data = [];
          files.forEach(file => {
            console.log('file -> ', file, 'typeof file', typeof file);
            // read file here
            data.push({ id: file.slice(0, file.length - 4), text: file.toString()});
          });
          resolve(data);

        }
      });
    });
  };

  var getTextPromises = (directory) => {
    return new Promise( (resolve, reject) => {
      fs.readFile(directory, (err, data) => {
        if (err) {
          reject(err);
        } else {
          console.log('data -> ', data.toString());
          resolve(data);
        }
      });
    });
  };
  // getFiles().then( (data) => console.log('here -> ', callback(null, data)) );

  getFiles()
    .then( (data) => {
      console.log('here -> ', callback(null, data));
      // return data;
      console.log('-> ', data);
      return data;
    })
    .then( (files) => {
      data = [];
      for ( var file of files ) {
        console.log('nere -> ', file);
        data.push(getTextPromises(exports.dataDir + '/' + file.text));
      }
      console.log('l -> ', data);
      return data;
    })
    .then( (data) => {
      console.log('answer -> ', Promise.all(data));
      return Promise.all(data);
    })
    .then ( (data) => {
      // data = [working,working,working]
      console.log('Answer -> ', data.toString().split(','));


    } )
    .catch( (err) => console.log('err -> ', err) );
  // .then( (files) => {
  //   data = [];
  //   // for ( var file in files ) {
  //   //   console.log('nere -> ', file);
  //   //   data.push(getTextPromises(exports.dataDir + '/' + file.text));
  //   // }
  //   return data;
  // })

  // .then ( (data) => {

  //   // return Promise.all(data);

  // })
  // .then ( (data) => {
  //   console.log('right here -> ', data);

  // } );

  // fs.readFile( path.join(__dirname, '/data/' + file.slice(0, file.length - 4) + '.txt'), (err, message) => {
  //   if (err) {
  //     console.log('err -> ', err);
  //   } else {
  //     data.push({ id: file.slice(0, file.length - 4), text: message.toString()});
  //     console.log('file data -> ', message.toString());
  //   }
  // });


  // var readFile = Promise.promisify(fs.readFile);
  // var readDir = Promise.promisify(fs.readdir);
  // var readOne = Promise.promisify(exports.readOne);






  // read currentDirectory
  // push all


  // fs.readFile(path.join(exports.dataDir, id + '.txt' ), (err, fileData) => {
  //   if (err) {
  //     console.log('error ->', error);
  //   } else {
  //     console.log('success reading ', fileData.toString(), ' from file ', id, '.txt ');
  //     callback(null, {id, text: fileData.toString()});
  //   }
  // });



  //promisify readdir
  //call it
  //then
  //push files to data
  //then
  //callback(null, data)
  //catch
  //callback(err)

};

exports.readOne = (id, callback) => {

  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }

  fs.readFile(path.join(exports.dataDir, id + '.txt' ), (err, fileData) => {
    if (err) {
      console.log('error ->', error);
    } else {
      console.log('success reading ', fileData.toString(), ' from file ', id, '.txt ');
      callback(null, {id, text: fileData.toString()});
    }
  });

};

exports.update = (id, text, callback) => {

  fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {

    if (err) {
      console.log('error - > ', err);
    }

    callback(null, {id, text});


  });
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }

  fs.unlink(path.join(exports.dataDir, id + '.txt'), (err) => {
    if (err) {
      console.log('error -> ', err);
    }
    callback();

  } );
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
