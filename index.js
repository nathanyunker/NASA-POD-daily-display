const apod = require("apod");
const config = require('./config');
const download = require('image-downloader')
const wallpaper = require('wallpaper');
 
// Create a config.js file in the root directory with <apiKey> and <imgDest> attributes. Example below:
// let config = {};

// config = {
//   apiKey: 'Enter Your NASA APOD API key here',
//   imageDest: 'Enter the path of desired file location, including desired file name. Example: 'C:/path/to/dest/photo.jpg''
// };

// module.exports = config;

apod.apiKey = config.apiKey;

function callback(err, data) {
  if (err) {
    console.log("ERROR recieving NASA Picture of the day: ", err);
  } else {
    console.log('Recieved NASA Picture of the Day...');
    saveImage(data.hdurl || data.url)
  }
}

function saveImage(imageUrl) {
  console.log("Attempting to save picutre to " + config.imageDest)

  const options = {
    url: imageUrl,
    dest: config.imageDest 
  }
   
  download.image(options)
    .then(({ filename, image }) => {
      console.log('File saved successfully')
      setWallpaper();
    }).catch((err) => {
      throw err
    })
}
 
function setWallpaper() {
  wallpaper.set(config.imageDest)
    .then(() => {
      console.log('WALLPAPER SET!');
    })
    .catch((err) => {
      console.log('ITS ERRORING OUT!!', err);
      throw err
    });
}

// get today's APOD:
//apod(callback);

// APOD for a specific date:
//apod("December 31, 1999", callback);
//or
//apod(1999, 11, 31, callback);

// random APOD: 
apod.random(callback);