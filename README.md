# Redeye

This project was built by pentesters for pentesters.
Redeye is a tool intended to help you manage your data during a pentest operation in the most efficient and organized way.

## Table of Contents
- [The Developers](#The-Developers)
- [Overview](#Overview)
- [Source Installation](#Source)
- [Docker Installation](#Docker)
- [Special Thanks](#Special-Thanks)
- [Credits](#Credits)


## The Developers
Daniel Arad - @dandan_arad && Elad Pticha - @elad_pt

## Overview

The Server panel will display all added server and basic information about the server such as: owned user, open port and if has been pwned.

 ![servers](https://raw.githubusercontent.com/redeye-framework/Redeye/dev/Pics/Servers.png)

After entering the server, An edit panel will appear. We can add new users found on the server, Found vulnerabilities and add relevant attain and files.

 ![edit-server](https://raw.githubusercontent.com/redeye-framework/Redeye/dev/Pics/EditServer.png)


Users panel contains all found users from all servers, The users are categorized by permission level and type. Those details can be chaned by hovering on the username.

![Users](https://raw.githubusercontent.com/redeye-framework/Redeye/dev/Pics/Users.png)

Files panel will display all the files from the current pentest. A team member can upload and download those files.

![Files](https://raw.githubusercontent.com/redeye-framework/Redeye/dev/Pics/Files.png)

Attack vector panel will display all found attack vectors with Severity/Plausibility/Risk graphs.

![AttackVector](https://raw.githubusercontent.com/redeye-framework/Redeye/dev/Pics/AttackVector.png)

PreReport panel will contain all the screenshots from the current pentest.  

![Pre-Report](https://raw.githubusercontent.com/redeye-framework/Redeye/dev/Pics/PreReport.png)



## Installation

### Source
```
cd Redeye
sudo apt install python3.8-venv
python3 -m venv RedeyeVirtualEnv
source RedeyeVirtualEnv/bin/activate
pip3 install -r requirements.txt
python3 RedDB/db.py
python3 redeye.py --safe
```

### Docker

Build with Dockerfile
```
cd Redeye
docker build -t redeye:latest .
docker run -p 5000:5000 redeye:latest
```

Pull from Dockerhub
```
docker pull redeyeframework/redeye:latest
sudo docker run -p 5000:5000 redeyeframework/redeye:latest
```

### General
Redeye will listen on: http://0.0.0.0:5000
</br>Default Credentials:
- username: redeye
- password: redeye


## Special-Thanks
- Yoav Danino for mental support and beta testing.

## Credits
* Sidebar
    * https://github.com/azouaoui-med/pro-sidebar-template 
    * https://bootsnipp.com/snippets/Q0dAX

* flowchart
    * https://www.jqueryscript.net/chart-graph/Drag-drop-Flow-Chart-Plugin-With-jQuery-jQuery-UI-flowchart-js.html

* download.js
    * http://danml.com/download.html

* dropzone
    * http://www.dropzonejs.com

* Pictures and Icons
    * https://www.iconfinder.com
        * licensed by - https://creativecommons.org/licenses/by/4.0
    * http://www.freepik.com
    


Redeye is under MIT License, if you own any Code/File in Redeye that is not under MIT License please contact us at: redeye.framework@gmail.com
