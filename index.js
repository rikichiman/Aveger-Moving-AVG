const argv = require('yargs').argv;   // Used to read command line arguments with options 
var output=[];  // This is my first OUT
var final_out=[];  //this is my final OUT
var l;             // Line of the file  
var date;   
var time;
var s=0;            // Sum of duration
var num_line=0;     //Number of lines read from the file
var avg=0;          //Average
var minute;
var current_minute; 
var start=0;        //Used as boolean variable to initialize current_time
var win_i;          // window_interval  
var in_file;        //Input file name

if (argv.input_file && argv.window_interval) {
    win_i=parseInt(argv.window_interval);
    in_file=argv.input_file;
} else {
    console.log('Please take a look a the documentation !');
    console.log("--input_file  <Path to the file> or filename   -----  Example:  --input_file events.json");
    console.log("--window_interval  <number of minutes> or it's 1 by default   -----  Example:  --window_interval 10");
    console.log("Try again :))");
}

if (!in_file) process.exit(0);

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(in_file)
  });

lineReader.on('line', function (line) {
        l = JSON.parse(line);
        
        date=l.timestamp.split(" ");
        time=date[1].split(":");
        
        if (start==0) { current_minute=parseInt(time[1]); start=1; }   // we initialize the first minute
        minute=parseInt(time[1]);
        seconds=parseInt(time[2].split('.')[0]);   //seconds
        
        var t=time.join(":");
        var d= date[0];
        d=d+" "+t;     // the formatted DATE

        while( current_minute <= minute ){
            if ( current_minute == minute ){
                if (seconds != 0){
                    let out={};
                    d=date[0]+" "+time[0]+":"+current_minute+":"+"00";
                    out.date=d;    
                    out.avg_delv_time=(avg==0)?0:avg;
                    out.d=0;                    
                    output.push(out);
                }
                let out2={};
                current_minute++;
                s+=l.duration;
                num_line++;
                avg=s/num_line;
                d=date[0]+" "+time[0]+":"+current_minute+":"+"00";
                out2.date=d;    
                out2.avg_delv_time=avg;
                out2.d=l.duration;
                output.push(out2);
                current_minute++;
                break;
            }
            let out3={};               
            d=date[0]+" "+time[0]+":"+current_minute+":"+"00";
            out3.date=d;    
            out3.avg_delv_time=avg;
            out3.d=0;
            output.push(out3);
            current_minute++;
        }
    }
);

lineReader.on('close', function () {
    //Finalizing the array with the average window and keeping only 2 fields
    for(var i=0; i< output.length;i++){
        var limit=(((i+1) - win_i)>0)?((i+1) - win_i):0;
        var s=0;
        var n=0;
        for(var j=i; j>=limit; j--){
            s+=output[j].d;
            n++
        }
        output[i].avg_delv_time=parseInt(s/n);
        final_out.push({
            date:output[i].date,
            average_delivery_time:output[i].avg_delv_time
        });
    }
    console.log(final_out);
});