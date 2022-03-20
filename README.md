# Redeye

This project was built by pentesters for pentester.
Redeye is a management tool for creating a workflow while doing a pentest operation. Redeye was made for running while in a differentiated environment and non differentiated likewise. Can be used for a specific operation or as a continuous database for data collected in previous operations.

## Table of Contents
- [Overview](#Overview)
- [Installation](#install)

## Overview

Servers Panel

 ![servers](https://raw.githubusercontent.com/redeye-framework/Redeye/dev/Pics/Servers.png)

 Server-edit Panel

 ![edit-server](https://raw.githubusercontent.com/redeye-framework/Redeye/dev/Pics/EditServer.png)


Users Panel

![Users](https://raw.githubusercontent.com/redeye-framework/Redeye/dev/Pics/Users.png)

Files Panel

![Files](https://raw.githubusercontent.com/redeye-framework/Redeye/dev/Pics/Files.png)

Attack-Vector Panel

![AttackVector](https://raw.githubusercontent.com/redeye-framework/Redeye/dev/Pics/AttackVector.png)

PreReport Panel

![Pre-Report](https://raw.githubusercontent.com/redeye-framework/Redeye/dev/Pics/PreReport.png)



## Installation:

The installation process is short and easy.

### prerequisites
 - Python3
 - Pip3
 - Cloned redeye project - `$ git clone git@github.com:sisitrs2/Redeye.git --depth=1`

### Source Installation
`$ cd Redeye`<br>
`$ chmod +x setup.sh && ./setup.sh`<br>
`$ python3 redeye.py`<br>

### Docker Installation

`chmod +x buildDocker.sh`<br>
`./buildDocker.sh`<br>
