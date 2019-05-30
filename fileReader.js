readFile = function (param) {
    //input is the object returned from readArgs() function
    var l; // Line of the file
    var date;
    var time;
    var minute;
    var start = 0; //Used as boolean variable to initialize current_time
    var win_i = param.winS; // window_interval
    var win_data = {
        listw: [],
        current_minute: 0,
        last_avg: 0
    };
    var lineReader = require("readline").createInterface({
        input: require("fs").createReadStream(param.in_f)
    });
    lineReader.on("line", function (line) {
        l = JSON.parse(line);
        date = l.timestamp.split(" ");
        time = date[1].split(":");

        if (start == 0) {
            win_data.current_minute = parseInt(time[1]); // initialize the first minute
            start = 1;
        }
        minute = parseInt(time[1]);
        seconds = parseInt(time[2].split(".")[0]); //seconds

        while (win_data.current_minute <= minute) {
            if (win_data.current_minute == minute) {
                if (seconds != 0) {
                    win_data = processAVG({
                        date: date[0] + " " + time[0] + ":" + win_data.current_minute + ":" + "00",
                        d: 0
                    }, win_data, win_i);
                }
                win_data = processAVG({
                    date: date[0] + " " + time[0] + ":" + win_data.current_minute + ":" + "00",
                    d: l.duration
                }, win_data, win_i);
                break;
            }
            win_data = processAVG({
                date: date[0] + " " + time[0] + ":" + win_data.current_minute + ":" + "00",
                d: 0
            }, win_data, win_i);
        }
    });
}

exports.fileReader = readFile;