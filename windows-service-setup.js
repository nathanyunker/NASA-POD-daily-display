var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'NASA-POD-daily-display',
  description: 'Set the wallpaper as the NASA Picture of the Day',
  script: 'C:/Dev/NASA-POD-daily-display/index.js',
  maxRestarts: 1,
  env: {
    name: "HOME",
    value: process.env["USERPROFILE"] // service is now able to access the user who created its' home directory 
  }
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
  svc.stop();
});

svc.install();