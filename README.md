# Aveger
Aveger is a command line tool made with Node.js
There is also a Python verion :))
## Goal 
  - Calculate, for every minute, a moving average of the translation delivery time for the last X minutes.

# Installation
#### Node.js
```sh
$ cd /projectDirectory
$ npm install
```
#### Python3
```sh
$ cd /projectDirectory
$ pip install -r requirements.txt
```

# Usage
```sh
$ node index.js --input_file fileName --window_size value
```
Or
```sh
$ python app.py --input_file fileName --window_size value
```
# Input file format
- Please take a look at events.json file.

# Example
##### input file events.json

Each line represents an object

```json
{"timestamp": "2018-12-26 18:11:08.509654","translation_id": "5aa5b2f39f7254a75aa5","source_language": "en","target_language": "fr","client_name": "easyjet","event_name": "translation_delivered","nr_words": 30, "duration": 20}
{"timestamp": "2018-12-26 18:15:19.903159","translation_id": "5aa5b2f39f7254a75aa4","source_language": "en","target_language": "fr","client_name": "easyjet","event_name": "translation_delivered","nr_words": 30, "duration": 31}
{"timestamp": "2018-12-26 18:23:19.903159","translation_id": "5aa5b2f39f7254a75bb33","source_language": "en","target_language": "fr","client_name": "booking","event_name": "translation_delivered","nr_words": 100, "duration": 54}
```
Execute the following command:

```sh
$ node index.js --input_file events.json --window_size 10
```

Or

```sh
$ python app.py --input_file events.json --window_size 10
```

Console output:

```sh
$ { date: '2018-12-26 18:11:00', average_delivery_time: 0 }
{ date: '2018-12-26 18:12:00', average_delivery_time: 20 }
{ date: '2018-12-26 18:13:00', average_delivery_time: 20 }
{ date: '2018-12-26 18:14:00', average_delivery_time: 20 }
{ date: '2018-12-26 18:15:00', average_delivery_time: 20 }
{ date: '2018-12-26 18:16:00', average_delivery_time: 25.5 }
{ date: '2018-12-26 18:17:00', average_delivery_time: 25.5 }
{ date: '2018-12-26 18:18:00', average_delivery_time: 25.5 }
{ date: '2018-12-26 18:19:00', average_delivery_time: 25.5 }
{ date: '2018-12-26 18:20:00', average_delivery_time: 25.5 }
{ date: '2018-12-26 18:21:00', average_delivery_time: 25.5 }
{ date: '2018-12-26 18:22:00', average_delivery_time: 31 }
{ date: '2018-12-26 18:23:00', average_delivery_time: 31 }
{ date: '2018-12-26 18:24:00', average_delivery_time: 42.5 }
```


