#!/usr/bin/env python

import os, re, sys, argparse, datetime

parser = argparse.ArgumentParser(description='Create videos in a range of dates')
parser.add_argument('-s','--start', help='start date in form path/imageYY-MM-DD', required=True)
parser.add_argument('-e','--end', help='start date in form imageYY-MM-DD', required=True)
parser.add_argument('-b','--bitrate', help='bitrate in kilobits per second')
parser.add_argument('-u','--upload', help='directory to upload the video folder containing video', default="")
args = parser.parse_args()
dateRegex = re.compile('^image(\d\d)-(\d\d)-(\d\d)$')
datePathRegex = re.compile('(.*)image(\d\d)-(\d\d)-(\d\d)$')

def parseDate (dateString):
    match = dateRegex.match(dateString)
    date = None
    if match:
        year = int(match.group(1))
        month = int(match.group(2))
        day = int(match.group(3))
        try:
            date = datetime.date(2000 + year, month, day)
        except ValueError:
            pass
    return date

def parseDatePath (dateName):
    match = datePathRegex.match(getattr(args,dateName))
    path = None
    date = None
    if match:
        path = match.group(1)
        year = int(match.group(2))
        month = int(match.group(3))
        day = int(match.group(4))
        try:
            date = datetime.date(2000 + year, month, day)
        except ValueError:
            pass
    if date is None:
        print '%s needs to be in the form imageYY-MM-DD' % dateName
        sys.exit(0)
    if path == "":
        path = './'
    return path, date

startPath, startDate = parseDatePath ('start')
endPath, endDate = parseDatePath ('end')
bitrate = args.bitrate
if startDate > endDate:
    print 'start must be greater that or equal to end'
    sys.exit(0)
if startPath != "" and not startPath.endswith('/'):
    print 'Bad path to the starting foler'
    sys.exit(0)
if endPath != "" and startPath != endPath:
    print 'The path to start must be the same as the path to end or end must not have a path'
    sys.exit(0)
if bitrate is not None:
    try:
        bitrate = int(bitrate)
    except ValueError:
        print 'bitrate must be an integer'
        sys.exit(0)
files = os.listdir(startPath)
files.sort()
for filename in files:
    date = parseDate(filename)
    if date is not None and date >= startDate and date <= endDate:
        folder = startPath + filename
        command = 'makeVideo.py -f %s' % folder
        if bitrate:
            command += ' -b %d' % bitrate
        os.system(command)
        if (args.upload):
            os.system("rsync -avz " + folder + "/timelapse.mp4" + " " + args.upload + "/" + filename + "/")
        print (filename)
