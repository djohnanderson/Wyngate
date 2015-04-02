#!/usr/bin/env python

import os, re, sys, shutil, argparse, tempfile
from datetime import datetime

parser = argparse.ArgumentParser(description='Find bad JPEGs in a folder')
parser.add_argument('-f','--folder', help='Folder of JPEGs', default="")
args = parser.parse_args()

folder = args.folder
if folder == "":
    today = datetime.today()
    folder = 'image%02d-%02d-%02d' % ((today.year - 2000), today.month, today.day - 1)
folder = folder + '/'

if not os.path.isdir(folder):
    print "Can't open " + folder
    sys.exit(0)

files = os.listdir(folder)
files.sort()

regex = re.compile('^(image\d\d-\d\d-\d\d)')

index = 0
for filename in files:
    filepath = folder + filename
    if os.path.isfile(filepath):
        match = regex.match(filename)
        if match:
            if os.system('/usr/bin/identify -verbose ' + filepath):
                print 'Bad jpeg file: ' + filename
