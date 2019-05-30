// Returns Argument's value inside a json Object
getArg = function () {
    // Used to read command line arguments with options
    const argv = require("yargs").argv;
    if (argv.input_file && argv.window_size && !isNaN(parseInt(argv.window_size))) {
        win_i = parseInt(argv.window_size);
        in_file = argv.input_file;
        return { in_f: in_file, winS: win_i };
    } else {
        console.log("Please take a look a the documentation !");
        console.log(
            "--input_file  <Path to the file> or filename   -----  Example:  --input_file events.json"
        );
        console.log(
            "--window_size  <number of minutes> or it's 1 by default   -----  Example:  --window_size 10"
        );
        process.exit(0);
    }
}

exports.readArgs = getArg;