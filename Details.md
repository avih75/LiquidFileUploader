# LiquidFile Uploader Build task

## Features

Uploading Folder files to your company LiquidFile server.

* upload in selected pool
* can send the file via link to email
* set expire date

## Configuration
### Server
* URL                           : (string) company main liquidefile url.
* Token                         : (string) must be at this construction "Basic XXX", the XXX must be token in 64base

### Configure
* Expire Gap                    : (number postive/negative) mandatory, set the gap in day.
*    

### Client
* email                         : (string) optional. client email, witch should get the file.
* subject                       : (string) optional. email subject.
* body                          : (string) optional. email body.