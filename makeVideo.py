#!/usr/bin/env python3

import os, re, sys, shutil, argparse, tempfile
from datetime import datetime

parser = argparse.ArgumentParser(description='Make a video from JPEGs in a folder')
parser.add_argument('-f','--folder', help='Folder of JPEGs', default="")
parser.add_argument('-o','--output', help='filename of video inside the foler', default="")
parser.add_argument('-u','--upload', help='directory to upload the video folder containing video', default="")
parser.add_argument('-b','--bitrate', help='bitrate in kilobits per second', default='2000')
parser.add_argument('-k','--keep_temporary', help='keep temporary files', action='store_true')
parser.add_argument('-v','--verbose', help='print extra debugging information', action='store_true')
args = parser.parse_args()

folder = args.folder
if folder == "":
    yesterday = datetime.today() - datetime.timedelta (days=1)
    folder = 'image%02d-%02d-%02d' % ((yesterday.year - 2000), yesterday.month, yesterday.day)
folder = folder + '/'

if not os.path.isdir(folder):
    print ("Can't open " + folder)
    sys.exit(0)

bitrate = args.bitrate
try:
    bitrate = int(bitrate)
except ValueError:
    print ('bitrate must be an integer')
    sys.exit(0)

output = args.output
if output == "":
    output = folder + 'timelapse.mp4'

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
            shutil.copy(filepath, tempDirectoryName + '/image%04d.jpg' % index)
            index = index + 1

verbose = ""
if args.verbose:
    verbose = ' -loglevel verbose'

command = ('/usr/bin/ffmpeg' + verbose + ' -y -r 25 -i ' + tempDirectoryName + '/image\%04d.jpg -b:v ' + str(bitrate) + 'k -vcodec h264_omx ' + output)

print (command)
os.system(command)

if not args.keep_temporary:
    shutil.rmtree(tempDirectoryName, ignore_errors=True)

def getFileNameFromPath (path):
    if path.endswith("/"):
        path = path[:-1]
    return os.path.basename(path)

if (args.upload):
    os.system("rsync -avz " + output + " " + args.upload + "/" + getFileNameFromPath(folder) + "/")
