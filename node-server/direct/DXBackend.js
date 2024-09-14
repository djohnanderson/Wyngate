var fs = require('fs'),
    moment = require('moment'),
    passwordHash = require('password-hash'),
    process = require('process'),
    path = require('path'),
    jsonfile = require('jsonfile'),
    merge = require('merge'),
    resourcesDirectory = path.join(process.cwd() + '/public/resources/wyngate/'),
    guestDateRangeFile = path.join(resourcesDirectory, 'guestDateRange.json'),
    defaultGuestDateRange = {
        start: "",
        end: ""
    };

var DXBackend = {
    setEnableDates: function(params, callback, sessionID, request) {
        jsonfile.readFile(guestDateRangeFile, function(error, guestDateRange) {
            if (error)
                guestDateRange = merge(true, defaultGuestDateRange);
            merge (guestDateRange, params);
            jsonfile.writeFile(guestDateRangeFile, guestDateRange); // ignore errors
        });
    },

    getVideoDates: function(params, callback, sessionID, request) {
        var dates = [],
            disabledDates = [],
            errorFunction = function(message) {
                callback(null, {
                    success: false,
                    msg: message
                });
            },
            date, start, end, userName, lastIndex, minDate, maxDate, length, nextVideoDate, yearMonthDate;

        jsonfile.readFile(guestDateRangeFile, function(error, guestDateRange) {
            if (error)
                guestDateRange = merge(true, defaultGuestDateRange);
            start = guestDateRange.start;
            end = guestDateRange.end;
            userName = params.userName;

            fs.readdir(resourcesDirectory, function(error, list) {
                if (error)
                    errorFunction('Error reading videos: "' + error.message + '"');
                else {
                    lastIndex = list.length - 1;
                    if (lastIndex < 0)
                        errorFunction('No videos found');
                    else
                        list.forEach(function(file, index) {
                            fs.stat(resourcesDirectory + file + '/timelapse.mp4', function(error, stat) {
                                if (stat && stat.isFile()) {
                                    date = '20' + file.substring(5);
                                    if ((userName !== 'guest') || ((!start || date >= start) && (!end || date <= end)))
                                        dates.push(date);
                                }
                                if (index == lastIndex) {
                                    length = dates.length;
                                    if (length === 0)
                                        errorFunction("No videos found");
                                    else {
                                        dates.sort();
                                        maxDate = moment(dates[length - 1], 'YYYY-MM-DD').format('MM/DD/YYYY');
                                        date = moment(dates.shift(), 'YYYY-MM-DD');
                                        minDate = date.format('MM/DD/YYYY');

                                        if (dates.length) {
                                            nextVideoDate = dates.shift();
                                            while (true) {
                                                date.add(1, 'days');
                                                yearMonthDate = date.format('YYYY-MM-DD');
                                                if (yearMonthDate === nextVideoDate) {
                                                    if (dates.length === 0)
                                                        break;
                                                    nextVideoDate = dates.shift();
                                                } else
                                                    disabledDates.push(date.format('MM/DD/YYYY'));
                                            }
                                        }
                                        callback(null, {
                                            success: true,
                                            minDate: minDate,
                                            maxDate: maxDate,
                                            disabledDates: disabledDates,
                                            guestDateRange: guestDateRange
                                        });
                                    }
                                }
                            });
                        });
                }
            });
        });
    },

    authenticate: function(params, callback, sessionID, request, response){
        var userName = params.username,
            password = params.password,
            users = {'john': 'sha1$0676e27f$1$90d919a8de6432587a5d43fa6c476dff2515e9b0',
                     'guest': 'sha1$4d537d41$1$49789d069628fc02f77c998c34d176ed509e8d13'},
            hash, result;

        //console.log(passwordHash.generate('guest'));
        hash = users[userName];
        if (hash && passwordHash.verify(password, hash)) {
            result = {
                success: true,
                message: 'Login successful',
                isSuperUser: userName === 'john'
            };
            console.log ('successful login: ', userName);
        } else {
            result = {
                success: false,
                message: 'Login unsuccessful'
            };
            console.log ('insuccessful login: ', userName);
        }
        callback(null, result);
    }
};

module.exports = DXBackend;