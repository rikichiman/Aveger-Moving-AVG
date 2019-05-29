const argv = require("yargs").argv; // Used to read command line arguments with options
listw = []; // its size never exceed the win size
var l; // Line of the file
var date;
var time;
var minute;
var current_minute;
var start = 0; //Used as boolean variable to initialize current_time
var win_i; // window_interval
var in_file; //Input file name
var last_avg = 0;

if (argv.input_file && argv.window_size) {
  win_i = parseInt(argv.window_size);
  in_file = argv.input_file;
} else {
  console.log("Please take a look a the documentation !");
  console.log(
    "--input_file  <Path to the file> or filename   -----  Example:  --input_file events.json"
  );
  console.log(
    "--window_size  <number of minutes> or it's 1 by default   -----  Example:  --window_size 10"
  );
  console.log("Try again :))");
}

if (!in_file) process.exit(0);

var lineReader = require("readline").createInterface({
  input: require("fs").createReadStream(in_file)
});

lineReader.on("line", function(line) {
  l = JSON.parse(line);
  var d; //Used to create a new formatted date for each minute
  date = l.timestamp.split(" ");
  time = date[1].split(":");

  if (start == 0) {
    current_minute = parseInt(time[1]); // initialize the first minute
    start = 1;
  }
  minute = parseInt(time[1]);
  seconds = parseInt(time[2].split(".")[0]); //seconds

  while (current_minute <= minute) {
    if (current_minute == minute) {
      if (seconds != 0) {
        processAVG({
          date: date[0] + " " + time[0] + ":" + current_minute + ":" + "00",
          d: 0
        });
      }
      processAVG({
        date: date[0] + " " + time[0] + ":" + current_minute + ":" + "00",
        d: l.duration
      });
      break;
    }
    processAVG({
      date: date[0] + " " + time[0] + ":" + current_minute + ":" + "00",
      d: 0
    });
  }
});

function processAVG(lo) {
  //lo = line object
  if (listw.length >= win_i) listw.shift();
  listw.push(lo);
  last_avg = getAvg();
  console.log({
    date: listw[listw.length - 1].date,
    average_delivery_time: last_avg
  });
  current_minute++;
}

function getAvg() {
  var s = 0,
    n = 0;
  for (var i = 0; i < listw.length; i++) {
    if (listw[i].d > 0) {
      s += listw[i].d;
      n++;
    }
  }
  return s == 0 ? last_avg : parseFloat(parseFloat(s / n).toPrecision(4));
}
