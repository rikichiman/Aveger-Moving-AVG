import json
import argparse
import sys
import os
listw = []  # its size never exceed the win size
last_avg = 0   # The last computed average
win_i = 0
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

#--- Read line by line and process the AVG at the same time IN ONE PARSE ---#


def readFile(filename, ws):
    global win_i
    start = 0            # Used as boolean variable to initialize current_time
    current_minute = None
    win_i = ws
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
                        processAVG({"date": d,
                                    "d": 0})
                    current_minute = current_minute + 1
                    d = date[0]+" "+time[0]+":" + \
                        str(current_minute)+":"+"00"
                    duration = int(l["duration"])
                    processAVG({"date": d,
                                "d": duration})
                    current_minute = current_minute + 1
                    break
                d = date[0]+" "+time[0]+":" +\
                    str(current_minute)+":"+"00"
                processAVG({"date": d,
                            "d": 0})
                current_minute = current_minute + 1

#--- Process the Avg for every minute ---#


def processAVG(lo):
    global last_avg
    global listw
    if (len(listw) >= win_i):
        listw.pop(0)
    listw.append(lo)
    last_avg = getAvg()
    print({
        "date": listw[len(listw)-1]["date"],
        "average_delivery_time": last_avg
    })


def getAvg():
    global last_avg
    global listw
    s = 0
    n = 0
    for i in range(len(listw)):
        if (listw[i]["d"] > 0):
            s += listw[i]["d"]
            n += 1
    return last_avg if (s == 0) else round(s/n, 2)


readFile(readArgs().input_file, readArgs().window_size)
