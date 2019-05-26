import json
import argparse
import sys
import os


#---- input arguments ----#
def readArgs():
    # Create parser to read arguments from CMD
    parser = argparse.ArgumentParser(description='Computes moving average.')
    # Add the input_file argument
    parser.add_argument(
        '--input_file', help='name of the json file containing the translation_delivered records.')
    # Add the window size argument
    parser.add_argument('--window_size', type=int, default=1,
                        help='size of the window (in minutes) to compute the moving average. Default value is 1.')
    args = parser.parse_args()

    # Validate arguments
    validateArgs(args)

    return(args)

#--- input arguments Validation  ---#


def validateArgs(args):
    # Check if user inserted input file size argument
    if args.input_file is None:
        print('Please specify the name of the input file!')
        sys.exit(1)

    # Check if input file exists
    if not os.path.isfile(args.input_file):
        print('There is no ' + args.input_file + ' JSON file!')
        sys.exit(1)

    # Check if window size is a natural number
    if args.window_size < 1:
        print('Window size must be a natural number!')
        sys.exit(1)

#--- create an array with all the minutes ---#


def readFile(filename):
    output = []          # This is my first OUT
    start = 0            # Used as boolean variable to initialize current_time
    current_minute = None
    with open('events.json') as file_object:
        for line in file_object:
            l = json.loads(line)
            date = l["timestamp"].split(" ")
            time = date[1].split(":")
            if (start == 0):
                current_minute = int(time[1])
                start = 1
            minute = int(time[1])
            seconds = int(time[2].split('.')[0])  # seconds
            while (current_minute <= minute):
                if (current_minute == minute):
                    if (seconds != 0):
                        d = date[0]+" "+time[0]+":" + \
                            str(current_minute)+":"+"00"
                        out = {"date": d,
                               "avg_delv_time": 0,
                               "d": 0}
                        output.append(out)
                    current_minute = current_minute + 1
                    d = date[0]+" "+time[0]+":" + \
                        str(current_minute)+":"+"00"
                    duration = int(l["duration"])
                    out2 = {"date": d,
                            "avg_delv_time": 0,
                            "d": duration}
                    output.append(out2)
                    current_minute = current_minute + 1
                    break
                d = date[0]+" "+time[0]+":" +\
                    str(current_minute)+":"+"00"
                out3 = {"date": d,
                        "avg_delv_time": 0,
                        "d": 0}
                output.append(out3)
                current_minute = current_minute + 1
    return output

#--- Process the Avg for every minute ---#


def close(out, win_i):
    final_out = []       # This is my final OUT
    last_avg = 0
    for i in range(len(out)):
        limit = ((i+1) - win_i) if (((i+1) - win_i) > 0) else 0
        s = 0
        n = 0
        for j in range(i, limit, -1):
            if (out[j]['d'] > 0):
                s += out[j]["d"]
                n = n + 1
        last_avg = last_avg if (s == 0) else round(s/n, 2)
        final_out.append({
            "date": out[i]["date"],
            "average_delivery_time": last_avg
        })
    return final_out


def show(list):
    for i in range(len(list)):
        print(list[i])


show(close(readFile(readArgs().input_file), readArgs().window_size))
