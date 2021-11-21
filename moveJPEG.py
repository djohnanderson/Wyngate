#!/usr/bin/env python3
import os, re, shutil, time
from datetime import datetime

os.chdir('/home/pi/ftp/wyngate')
files = os.listdir('.')
files.sort()
regex = re.compile('^(image\d\d-\d\d-\d\d)')
for filename in files:
    if os.path.isfile(filename):
        deltaTime = datetime.fromtimestamp(time.time()) - datetime.fromtimestamp(os.path.getmtime(filename))
        if deltaTime.total_seconds() > (60 * 10):
            if os.stat(filename).st_size == 0:
                os.remove(filename)
            else:
                match = regex.match(filename)
                if match:
                    directory = match.groups()[0]
                    if directory == 'image70-01-01':
                        os.remove(filename)
                    else:
                        if not os.path.exists(directory):
                            os.makedirs(directory)
                        # Unfortunatley shutil.move doesn't overwrite -- even if I specify full paths
                        destination = os.path.join(directory, filename)
                        if os.path.exists(destination):
                            os.remove(destination)
                        shutil.move(filename, directory)

