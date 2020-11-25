"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquidFileUploader = void 0;
const fs = require("fs");
const request = require("request");
class LiquidFileUploader {
    constructor(inputUrl, inputToken, inputDays, inputFolder, inputPrivat, inputPool, inputEmails, inputAuth) {
        this.InputUrl = inputUrl || "";
        this.InputToken = inputToken || "";
        this.InputDays = inputDays || "";
        this.InputFolder = inputFolder || "";
        this.InputAuth = inputAuth || false;
        this.InputPrivat = inputPrivat || "";
        this.InputPool = inputPool || "";
        this.InputEmails = inputEmails || "";
        this.FailMessage = "";
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }
    Test() {
        let flag = true;
        console.log('Input paramters list:');
        this.FailMessage = "the faild checks";
        if (this.InputUrl == "") // if leg
         {
            this.FailMessage += "Wrong URL \n";
            flag = false;
        }
        else {
            console.log('URL:', this.InputUrl);
        }
        if (this.InputToken == "") {
            this.FailMessage += "Wrong Token \n";
            flag = false;
        }
        else {
            console.log("Token: " + this.InputToken);
        }
        if (this.InputDays == "") {
            this.FailMessage += "No Days.... Add 3 Day as default \n";
        }
        else {
            console.log('Days: ', this.InputDays);
        }
        if (this.InputFolder == "") // if exists
         {
            this.FailMessage += "Wrong folder \n";
            flag = false;
        }
        else { // if empty - message empty and flag = false
            console.log('Folder: ', this.InputFolder);
        }
        if (this.InputPool == "") {
            this.FailMessage += "Wrong pool name \n";
            flag = false;
        }
        else {
            console.log('pool: ', this.InputPool);
        }
        if (this.InputEmails == "") {
            this.FailMessage += "no Email \n";
            flag = false;
        }
        else {
            console.log('emails: ', this.InputEmails);
        }
        if (this.InputPrivat == "") {
            this.FailMessage += "no Auth \n";
            flag = false;
        }
        else {
            console.log('Privacy selected: ', this.InputPrivat);
            this.InputPrivat = this.InputPrivat[0];
        }
        console.log('Auth selected: ', this.InputAuth);
        //this.GetList();
        return flag;
    }
    UploadTheFiles() {
        let flag = true;
        let message = "";
        console.log("Look in to: " + this.InputFolder + " folder");
        fs.readdir(this.InputFolder, (err, filenames) => {
            console.log("fonded: " + filenames);
            if (filenames)
                this.PostFiles(filenames);
            else {
                flag = false;
                message += "empty folder \n";
            }
        });
    }
    PostFiles(filenames) {
        let folder = this.InputFolder;
        let PostFile = this.PostTheFile;
        let url = this.InputUrl;
        let token = this.InputToken;
        let pool = this.InputPool;
        let days = this.InputDays;
        let email = this.InputEmails;
        let privFile = this.InputPrivat;
        filenames.forEach(function (fileName) {
            console.log("work on file: " + fileName);
            let fileBuffer = Buffer.from(folder + fileName);
            console.log("try upload");
            PostFile(fileBuffer, fileName, url, token, pool, email, +days, privFile);
            console.log("file uploaded");
        });
    }
    PostTheFile(fileBuffer, fileName, url, token, pool, email, days, privFile) {
        console.log("try post file " + fileName + " to: " + url + " pool: " + pool + " token: " + token);
        try {
            const options = {
                'method': 'POST',
                'url': url + "/attachments",
                'headers': {
                    "Authorization": token
                },
                formData: {
                    'pool_id': pool,
                    '': {
                        "value": fileBuffer,
                        'options': {
                            'filename': fileName,
                            'contentType': 'multipart/form-data'
                        }
                    }
                }
            };
            request(options, function (error, response) {
                if (error) {
                    console.log("got an error: " + error);
                    throw new Error(error);
                }
                console.log("Attachment Id: " + response.body);
                let expireDate = new Date((new Date).getTime() + (1000 * 60 * 60 * 24) * days);
                console.log("Send to Mail: " + email + " expire: " + expireDate);
                let data = {
                    "message": {
                        "recipients": email,
                        "subject": "Liquid File Qognify",
                        "message": "This file sended by Auto API",
                        "expires_at": expireDate,
                        "send_email": true,
                        "authorization": privFile,
                        "attachments": [response.body]
                    }
                };
                let options = {
                    'method': 'POST',
                    'url': url + '/message',
                    'headers': {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "message": data.message })
                };
                request(options, function (error, resp) {
                    if (error)
                        throw new Error(error);
                    else
                        console.log("respone off Mail: " + resp.body);
                });
            });
        }
        catch (err) {
            console.log("error: " + err);
        }
    }
    GetList() {
        console.log(this.InputUrl + "/admin/pools" + " token: " + this.InputToken);
        const options = {
            'url': this.InputUrl + "/admin/pools",
            'headers': {
                "Content-Type": "application/json",
                "Authorization": this.InputToken
            }
        };
        request(options, function (error, response, body) {
            console.log("responed");
            if (!error && response.statusCode == 200) {
                const info = JSON.parse(body);
                console.log("response: " + info);
            }
            else {
                console.log("error: " + error);
            }
        });
    }
}
exports.LiquidFileUploader = LiquidFileUploader;
