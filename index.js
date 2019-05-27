const argv = require("yargs").argv; // Used to read command line arguments with options
var output = []; // This is my first OUT
var l; // Line of the file
var date;
var time;
var minute;
var current_minute;
var start = 0; //Used as boolean variable to initialize current_time
var win_i; // window_interval
var in_file; //Input file name

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
        d = date[0] + " " + time[0] + ":" + current_minute + ":" + "00";
        output.push({ date: d, d: 0 });
      }
      current_minute++;
      d = date[0] + " " + time[0] + ":" + current_minute + ":" + "00";
      output.push({ date: d, d: l.duration });
      current_minute++;
      break;
    }
    d = date[0] + " " + time[0] + ":" + current_minute + ":" + "00";
    output.push({ date: d, d: 0 });
    current_minute++;
  }
});

lineReader.on("close", function() {
  //Finalizing the array with the average window and keeping only 2 fields
  var last_avg = 0;
  for (var i = 0; i < output.length; i++) {
    var limit = i + 1 - win_i > 0 ? i + 1 - win_i : 0;
    var s = 0;
    var n = 0;
    for (var j = i; j > limit; j--) {
      if (output[j].d > 0) {
        s += output[j].d;
        n++;
      }
    }
    last_avg = s == 0 ? last_avg : parseFloat(parseFloat(s / n).toPrecision(4));
    console.log({
      date: output[i].date,
      average_delivery_time: last_avg
    });
  }
});
