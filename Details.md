# LiquidFile Uploader Build task

## Features

Uploading Folder files to your company LiquidFile server.

* upload into a selected pool
* can send the files via link to email
* set expire date

## Configuration
#### Server
* Liquid server         : (string) company main liquidefile url.
* Token Base64          : (string) must be at this construction "Basic XXX", (XXX token number)
* Pool name             : (string) if you like to upload the file in to specific pool

#### Configure
* Expire gap            : (number postive/negative) mandatory, set the gap in day.
* Upload folder         : (string) mandatory, folder from witch you want to upload files
* Download Permmision   : (Boolean) set the paramete if the file is for specific usesr or open to every one
* Grouped mail          : (Boolean) determin if to send all links in one mail or mail for each file
* Require Auth          : (boolean) determin if the client need to login for downloading.
* Delete Source         : (boolean) Set the parameter if you need to delete the file from the folder.

#### Client
* Target email          : (string) optional. client email, witch should get the file.
* Email subject         : (string) optional. email subject.
* Email body            : (string) optional. email body.