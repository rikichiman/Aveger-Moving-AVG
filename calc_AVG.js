processAVG = function (lo, win_data, win_i) {
    //lo = line object
    if (win_data.listw.length >= win_i) win_data.listw.shift();
    win_data.listw.push(lo);
    win_data.last_avg = getAvg(win_data);
    console.log({
        date: win_data.listw[win_data.listw.length - 1].date,
        average_delivery_time: win_data.last_avg
    });
    win_data.current_minute++;
    return win_data;
}

getAvg = function (win_data) {
    var s = 0,
        n = 0;
    for (var i = 0; i < win_data.listw.length; i++) {
        if (win_data.listw[i].d > 0) {
            s += win_data.listw[i].d;
            n++;
        }
    }
    return s == 0 ? win_data.last_avg : parseFloat(parseFloat(s / n).toPrecision(4));
}

exports.processAVG = processAVG;