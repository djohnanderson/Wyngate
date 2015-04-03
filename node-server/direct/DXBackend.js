var fs = require('fs'),
    moment = require('moment'),
    passwordHash = require('password-hash'),
    process = require('process'),
    path = require('path'),
    jsonfile = require('jsonfile'),
    merge = require('merge'),
    resourcesDirectory = path.join(process.cwd() + '/public/resources/wyngate/'),
    enableDatesFile = path.join(resourcesDirectory, 'enableDates.json'),
    defaultEnableDates = {
        start: "2000-00-00",
        end: "2099-12-31"
    };

var DXBackend = {
    setEnableDates: function(params, callback, sessionID, request) {
        var user = request.session.user,
        enableDates;

        if (user === 'john') {
            enableDates = merge(true, defaultEnableDates);
            jsonfile.readFile(enableDatesFile, function(error, object) {
                if (!error)
                    merge (enableDates, object);
                merge (enableDates, params);
                jsonfile.writeFile(enableDatesFile, enableDates); // ignore errors
            });
        }
    },

    getVideoDates: function(params, callback, sessionID, request){
        var dates = [],
            disabledDates = [],
            enableDates = merge(true, defaultEnableDates),
            resourcesDirectory = path.join(process.cwd() + '/public/resources/wyngate/'),
            date, lastIndex, minDate, maxDate, length, nextVideoDate, yearMonthDate;

        try {
            jsonfile.readFile(enableDatesFile, function(error, object) {
                console.log ('getVideoDates user: ', request.session.user, ' error: ', error);
                if (request.session.user !== 'john' && !error)
                    merge (enableDates, object);
                console.log ('start: ', enableDates.start, ' end: ', enableDates.end);

                fs.readdir(resourcesDirectory, function (error, list) {
                    if (error)
                        throw error;
                    lastIndex = list.length - 1;
                    if (lastIndex < 0)
                        throw new Error("No video's found");
                    else
                        list.forEach(function (file, index) {
                            fs.stat(resourcesDirectory + file + '/timelapse.mp4', function (error, stat) {
                                if (stat && stat.isFile()) {
                                    date = '20' + file.substring(5);
                                    if (date >= enableDates.start && date <= enableDates.end)
                                        dates.push(date);
                                }
                                if (index == lastIndex) {
                                    length = dates.length;
                                    if (length === 0)
                                        throw new Error("No video's found");
                                    dates.sort();
                                    date = moment(dates.shift(), 'YYYY-MM-DD');
                                    minDate = date.format('MM/DD/YYYY');
                                    maxDate = moment(dates[length-2], 'YYYY-MM-DD').format('MM/DD/YYYY');
                                    if (dates.length) {
                                        nextVideoDate = dates.shift();
                                        while(true) {
                                            date.add('days', 1);
                                            yearMonthDate = date.format('YYYY-MM-DD');
                                            if (yearMonthDate === nextVideoDate) {
                                                if (dates.length === 0)
                                                    break;
                                                nextVideoDate = dates.shift();
                                            } else
                                                disabledDates.push(date.format('MM/DD/YYYY'));
                                        }
                                    }
                                    callback({
                                        success: true,
                                        params: params,
                                        minDate: minDate,
                                        maxDate: maxDate,
                                        disabledDates: disabledDates
                                    });
                                }
                            });
                        });
                });
            });
        } catch (error) {
            callback({
                success: false,
                msg: error.message,
                params: params
            });
        }
    },

    authenticate: function(params, callback, sessionID, request, response){
        var username = params.username,
            password = params.password,
            users = {'john': 'sha1$0676e27f$1$90d919a8de6432587a5d43fa6c476dff2515e9b0',
                     'guest': 'sha1$4d537d41$1$49789d069628fc02f77c998c34d176ed509e8d13'},
            hash, result;

        //console.log(passwordHash.generate('guest'));
        hash = users[username];
        if (hash && passwordHash.verify(password, hash)) {
            result = {
                success: true,
                message: 'Login successful'
            };
            request.session.user = username;
            console.log ('successful login: ', request.session.user);
        } else {
            result = {
                success: false,
                message: 'Login unsuccessful'
            };
            request.session.user = "";
            console.log ('insuccessful login: ', request.session.user);
        }
        callback(result);
    }
};

module.exports = DXBackend;