const apod = require("apod");
const config = require('./config');
const download = require('image-downloader');
var fs = require('fs');
const wallpaper = require('wallpaper');
 
// Create a config.js file in the root directory with <apiKey> and <imgDest> attributes. May also set the number of previous days to search if current day is not a picture. Example below:
// let config = {};

// config = {
//   apiKey: 'Enter Your NASA APOD API key here',
//   imageDest: 'Enter the path of desired file location, including desired file name. Example: 'C:/path/to/dest/photo.jpg''
//   maxRetries: 7
// };

// module.exports = config;



apod.apiKey = config.apiKey;
let pictureDate = new Date();
let retries = 0;

function processImage(err, data) {
  if (err) {
    console.log("ERROR recieving NASA Picture of the day: ", err);
  } else {
    if (data.media_type === 'image') {
      console.log('Recieved NASA Picture of the Day...');
      saveImage(data.hdurl || data.url)
    } else {
      console.log('Media Type is not an Image. Using Picture for previous day.')
      usePictureFromPreviousDay();
    }
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
      throw err;
    })
}
 
function setWallpaper() {
  wallpaper.set(config.imageDest)
    .then(() => {
      console.log('Wallpaper Set!');
    })
    .catch((err) => {
      throw err;
    });
}

function usePictureFromPreviousDay() {
  pictureDate.setDate(pictureDate.getDate() - 1);
  retries ++;

  if (retries > (config.maxRetries || 7)) {
    console.log('Unable to find a Picture of the Day for the last ' + retries + ' days.')
  } else {
    console.log('Retrieving NASA picture of the day for: ' + pictureDate.toDateString());
    apod(pictureDate, processImage)
  }
}

// get today's APOD:
apod(processImage);

// APOD for a specific date:
//apod("December 31, 1999", processImage);
//or
//apod(1999, 11, 31, processImage);

// random APOD: 
//apod.random(processImage);