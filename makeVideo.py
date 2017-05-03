#!/usr/bin/env python

import os, re, sys, shutil, argparse, tempfile, Image
from datetime import datetime

parser = argparse.ArgumentParser(description='Make a video from JPEGs in a folder')
parser.add_argument('-f','--folder', help='Folder of JPEGs', default="")
parser.add_argument('-o','--output', help='filename of video inside the foler', default="")
parser.add_argument('-u','--upload', help='directory to upload the video folder containing video', default="")
parser.add_argument('-b','--bitrate', help='bitrate in kilobits per second', default='2500')
parser.add_argument('-k','--keep_temporary', help='keep temporary files', action='store_true')
parser.add_argument('-v','--verbose', help='print extra debugging information', action='store_true')
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

output = args.output
if output == "":
    output = folder + 'timelapse.mp4'
tempFile = folder + 'output.h264'

files = os.listdir(folder)
files.sort()

regex = re.compile('^(image\d\d-\d\d-\d\d)')
tempDirectoryName = tempfile.mkdtemp()
shutil.rmtree(tempDirectoryName, ignore_errors=True)
os.makedirs(tempDirectoryName)

index = 0
for filename in files:
    filepath = folder + filename
    if os.path.isfile(filepath):
        match = regex.match(filename)
        if match:
            try:
                file = Image.open(filepath)
            except IOError:
                pass
            else:
                if args.verbose:
                    print 'jpeg size: ' + str(file.size) # All jpegs must be the same size otherwise gStream barfs with unintelligible error
                shutil.copy(filepath, tempDirectoryName + '/image%04d.jpg' % index)
                index = index + 1

# Here is the command that does the conversion without hardware acceleration:
#os.system('/usr/bin/avconv -loglevel verbose -y -r 10 -i ' + tempDirectoryName + '/image\%04d.jpg -r 10 -b' + str(bitrate) + 'k -vcodec libx264 ' + output)

verbose = ""
if args.verbose:
    verbose = ' --gst-debug-level=2'

# And here's the command that does it with hardware acceleration:
# Normally you'd add mp4mux to the end of the stream to produce the mp4 but that produces a mp4 that Chrome can't play,
# So we'll package it with MP4Box
command = ('/usr/bin/gst-launch-1.0' + verbose + ' -e multifilesrc location="' + tempDirectoryName +
           '/image\%04d.jpg" ! image/jpeg, framerate=10/1 ! jpegdec ! queue ! progressreport name=progress ! ' +
           'omxh264enc target-bitrate=' + str(bitrate) + '000 control-rate=variable ! video/x-h264, profile=high ! '+
           'h264parse ! filesink location="' + tempFile + '"')
print (command)
os.system(command)

command = 'MP4Box -new -add ' + tempFile + ' ' + output
print (command)
os.system(command)
os.remove(tempFile)

if not args.keep_temporary:
    shutil.rmtree(tempDirectoryName, ignore_errors=True)

def getFileNameFromPath (path):
    if path.endswith("/"):
        path = path[:-1]
    return os.path.basename(path)

if (args.upload):
    os.system("rsync -avz " + output + " " + args.upload + "/" + getFileNameFromPath(folder) + "/")
