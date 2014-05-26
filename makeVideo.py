#!/usr/bin/env python

import os, re, sys, shutil, argparse, tempfile
from datetime import datetime

parser = argparse.ArgumentParser(description='Make a video from JPEGs in a folder')
parser.add_argument('-f','--folder', help='Folder of JPEGs', default="")
parser.add_argument('-o','--output', help='Folder of JPEGs', default="")
parser.add_argument('-b','--bitrate', help='bitrate in kilobits per second', default='2500')
args = parser.parse_args()

folder = args.folder
if folder == "":
    today = datetime.today()
    folder = 'image%02d-%02d-%02d' % ((today.year - 2000), today.month, today.day - 1)
folder = folder + '/'

if not os.path.isdir(folder):
    print "Can't open " + folder
    sys.exit(0)

bitrate = args.bitrate
try:
    bitrate = int(bitrate)
except ValueError:
    print 'bitrate must be an integer'
    sys.exit(0)
bitrate = '-b %dk' % bitrate

output = args.output
if output == "":
    output = folder + 'timelapse.mp4'

files = os.listdir(folder)
files.sort()

regex = re.compile('^(image\d\d-\d\d-\d\d)')
tempDirectoryName = tempfile.mkdtemp()
os.removedirs(tempDirectoryName)
os.makedirs(tempDirectoryName)

index = 0
for filename in files:
    filepath = folder + filename
    if os.path.isfile(filepath):
        match = regex.match(filename)
        if match:
            shutil.copy(filepath, tempDirectoryName + '/image%04d.jpg' % index)
            index = index + 1

os.system('/usr/bin/avconv -y -r 10 -i ' + tempDirectoryName + '/image\%04d.jpg -r 10 ' + bitrate + ' -vcodec libx264 ' + output)
os.removedirs(tempDirectoryName)

