var fs = require('fs');
var moment = require('moment');
var passwordHash = require('password-hash');
var process = require('process');

var DXBackend = {
    getVideoDates: function(params, callback){
        var dates = [],
            disabledDates = [],
            directory = process.cwd() + '/public/resources/wyngate/',
            date, lastIndex, minDate, maxDate, length, nextVideoDate, yearMonthDate;

        try {
            fs.readdir(directory, function (error, list) {
                if (error)
                    throw error;
                lastIndex = list.length - 1;
                if (lastIndex < 0)
                    throw new Error("No video's found");
                else
                    list.forEach(function (file, index) {
                        fs.stat(directory + file + '/timelapse.mp4', function (error, stat) {
                            if (stat && stat.isFile())
                                dates.push(file.substring(5));
                            if (index == lastIndex) {
                                length = dates.length;
                                if (length === 0)
                                    throw new Error("No video's found");
                                dates.sort();
                                date = moment(dates.shift(), 'YY-MM-DD');
                                minDate = date.format('MM/DD/YYYY');
                                maxDate = moment(dates[length-2], 'YY-MM-DD').format('MM/DD/YYYY');
                                if (dates.length) {
                                    nextVideoDate = dates.shift();
                                    while(true) {
                                        date.add('days', 1);
                                        yearMonthDate = date.format('YY-MM-DD');
                                        if (yearMonthDate === nextVideoDate) {
                                            if (dates.length === 0)
                                                break;
                                            nextVideoDate = dates.shift();
                                        } else
                                            disabledDates.push(date.format('MM/DD/YYYY'));
                                    }
                                }
                                callback({
                                    success:true,
                                    params: params,
                                    minDate: minDate,
                                    maxDate: maxDate,
                                    disabledDates: disabledDates
                                });
                            }
                        });
                    });
            });
        } catch (error) {
            callback({
                success:false,
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
        } else {
            result = {
                success: false,
                message: 'Login unsuccessful'
            };
        }
        callback(result);
    }
};

module.exports = DXBackend;