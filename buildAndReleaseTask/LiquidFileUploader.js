"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquidFileUploader = void 0;
const fs = require("fs");
const request = require("request");
class LiquidFileUploader {
    constructor(inputUrl, inputToken, inputDays, inputFolder, inputPrivat, inputPool, inputEmail, inputSubject, inputBody, inputAuth) {
        this.InputBody = inputBody || "";
        this.InputSubject = inputSubject || "";
        this.InputUrl = inputUrl || "";
        this.InputToken = inputToken || "";
        this.InputDays = inputDays || "";
        this.InputFolder = inputFolder || "";
        this.InputAuth = inputAuth || false;
        this.InputPrivat = inputPrivat || "";
        this.InputPool = inputPool || "";
        this.InputEmail = inputEmail || "";
        this.Message = "";
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }
    AddMessage(message) {
        this.Message += message + "\n";
        console.log('Test Message: ' + message);
    }
    Test() {
        let flag = true;
        console.log('Input paramters list:');
        this.AddMessage("the faild checks");
        if (this.InputUrl == "") // if leg
         {
            this.AddMessage("Wrong URL");
            flag = false;
        }
        else {
            console.log('URL:', this.InputUrl);
        }
        if (this.InputToken == "") {
            this.AddMessage("Wrong Token");
            flag = false;
        }
        else {
            console.log("Token: " + this.InputToken);
        }
        if (this.InputDays == "") {
            this.AddMessage("No Days.... Add 3 Day as default");
            this.InputDays = "3";
        }
        else {
            console.log('Days: ', this.InputDays);
        }
        if (this.InputFolder == "") // if exists
         {
            this.AddMessage("Wrong folder");
            flag = false;
        }
        else { // if empty - message empty and flag = false
            console.log('Folder: ', this.InputFolder);
        }
        if (this.InputPool == "") {
            this.AddMessage("No pool selected");
            //flag = false;
        }
        else {
            console.log('pool: ', this.InputPool);
        }
        if (this.InputEmail == "") {
            this.AddMessage("no Email");
        }
        else {
            console.log('email: ', this.InputEmail);
        }
        if (this.InputBody == "") {
            this.AddMessage("no Body ....add default string");
            this.InputBody = "file was sented to you by LiquidFile Task";
        }
        else {
            console.log('email: ', this.InputBody);
        }
        if (this.InputSubject == "") {
            this.AddMessage("no Body ....add default string");
            this.InputSubject = "LiquidFile Task Auto mail";
        }
        else {
            console.log('email: ', this.InputSubject);
        }
        if (this.InputPrivat == "") {
            this.AddMessage("no Auth");
            flag = false;
        }
        else {
            console.log('Privacy selected: ', this.InputPrivat);
        }
        console.log('Auth selected: ', this.InputAuth);
        //this.GetList();
        return flag;
    }
    UploadTheFiles() {
        console.log("Look in to: " + this.InputFolder + " folder");
        fs.readdir(this.InputFolder, (err, filenames) => {
            if (filenames) {
                console.log("fonded: " + filenames);
                this.PostFiles(filenames);
            }
            else {
                this.AddMessage("empty folder \n");
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
        let email = this.InputEmail;
        let subject = this.InputSubject;
        let body = this.InputBody;
        let privFile = this.InputPrivat;
        filenames.forEach(function (fileName) {
            console.log("work on file: " + fileName);
            let fileBuffer = Buffer.from(folder + fileName);
            console.log("try upload");
            PostFile(fileBuffer, fileName, url, token, pool, email, +days, privFile, subject, body);
            console.log("file uploaded");
        });
    }
    PostTheFile(fileBuffer, fileName, url, token, pool, email, days, privFile, subject, body) {
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
            if (email != "") {
                console.log("sendinf mail to: " + email);
                console.log("subject: " + subject);
                console.log("body: " + body);
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
                            "subject": subject,
                            "message": body,
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
                        if (error) {
                            throw new Error(error);
                        }
                        else
                            console.log("respone off Mail: " + resp.body);
                    });
                });
            }
        }
        catch (err) {
            this.AddMessage("faile to upload \n");
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
