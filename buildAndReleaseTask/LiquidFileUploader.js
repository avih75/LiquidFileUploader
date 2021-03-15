"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadTheFiles = exports.LiquidFileUploader = void 0;
const fs = require("fs");
const util = require("util");
const q_1 = require("q");
const request = require("request");
let Model;
const readFile = util.promisify(fs.createReadStream);
const postFilee = util.promisify(request);
function getStuff(path) {
    return readFile(path, undefined);
}
function pushStuff(options) {
    return postFilee(options);
}
class LiquidFileUploader {
    constructor(inputUrl, inputToken, inputDays, inputFolder, inputPrivat, inputPool, inputEmail, inputSubject, inputBody, groupedFiles, inputDell, inputAuth) {
        this.InputBody = inputBody || "";
        this.InputSubject = inputSubject || "";
        this.InputUrl = inputUrl || "";
        this.InputToken = inputToken || "";
        this.InputDays = inputDays || "";
        this.InputFolder = inputFolder || "";
        this.InputAuth = inputAuth || false;
        this.InputDell = inputDell || false;
        this.InputPrivat = inputPrivat || "";
        this.InputPool = inputPool || "";
        this.InputEmail = inputEmail || "";
        this.GroupedFiles = groupedFiles || false;
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
        if (flag)
            Model = this;
        return flag;
    }
}
exports.LiquidFileUploader = LiquidFileUploader;
function UploadTheFiles() {
    console.log("Look in to: " + Model.InputFolder + " folder");
    fs.readdir(Model.InputFolder, (err, filenames) => __awaiter(this, void 0, void 0, function* () {
        if (filenames) {
            console.log("fonded: " + filenames);
            yield PostFiles2(filenames);
        }
        else {
            Model.AddMessage("empty folder \n");
        }
    }));
}
exports.UploadTheFiles = UploadTheFiles;
function PostFiles(filenames) {
    return __awaiter(this, void 0, void 0, function* () {
        let attachments = new Array();
        let counter = 0;
        filenames.forEach(function (fileName) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("work on file: " + Model.InputFolder + "\\" + fileName);
                const readStream = fs.createReadStream(Model.InputFolder + "\\" + fileName);
                console.log("file content: " + readStream);
                console.log("try upload");
                PostFile(readStream, fileName, attachments);
                console.log("file uploaded");
                counter++;
            });
        });
        let x = 0;
        while (counter > attachments.length) {
            while (attachments.length > x) {
                console.log("uploaded: " + x + " of total: " + counter);
                x++;
            }
            yield q_1.delay(1000);
        }
        console.log("Total uploaded: " + attachments.length);
        if (attachments.length > 0 && Model.InputEmail != "") {
            console.log("sending mail to: " + Model.InputEmail);
            console.log("subject: " + Model.InputSubject);
            console.log("body: " + Model.InputBody);
            if (Model.GroupedFiles) {
                SendMail(attachments);
            }
            else {
                attachments.forEach(attach => {
                    let attachment = new Array();
                    attachment.push(attach);
                    SendMail(attachment);
                });
            }
        }
    });
}
function PostFile(fileBuffer, fileName, attachments) {
    console.log("try post file " + fileName + " to: " + Model.InputUrl + " pool: " + Model.InputPool + " token: " + Model.InputToken);
    try {
        const options = {
            'method': 'POST',
            'url': Model.InputUrl + "/attachments",
            'headers': {
                "Authorization": Model.InputToken
            },
            formData: {
                'pool_id': Model.InputPool,
                '': {
                    "value": fileBuffer,
                    'options': {
                        'filename': fileName,
                        'contentType': 'multipart/form-data'
                    }
                }
            }
        };
        let x = ".";
        request(options, function (error, response) {
            if (error) {
                console.log("got an error: " + error);
                x = error;
            }
            else {
                console.log("Attachment Id: " + response.body);
                x = response.body;
                attachments.push(x);
                if (Model.InputDell)
                    DeleteFiles(fileName);
            }
        });
    }
    catch (err) {
        Model.AddMessage("faile to upload \n");
        console.log("error: " + err);
        return "";
    }
}
function SendMail(attachments) {
    let expireDate = new Date((new Date).getTime() + (1000 * 60 * 60 * 24) * +Model.InputDays);
    console.log("Send to Mail: " + Model.InputEmail + " expire: " + expireDate);
    let data = {
        "message": {
            "recipients": Model.InputEmail,
            "subject": Model.InputSubject,
            "message": Model.InputBody,
            "expires_at": expireDate,
            "send_email": true,
            "authorization": Model.InputPrivat,
            "attachments": attachments
        }
    };
    let options = {
        'method': 'POST',
        'url': Model.InputUrl + '/message',
        'headers': {
            'Authorization': Model.InputToken,
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
}
function DeleteFiles(filename) {
    console.log("Deleting file: " + filename);
}
function GetList() {
    // get list of all pools and files in cluded - in case we need to get files
    console.log(Model.InputUrl + "/admin/pools" + " token: " + Model.InputToken);
    const options = {
        'url': Model.InputUrl + "/admin/pools",
        'headers': {
            "Content-Type": "application/json",
            "Authorization": Model.InputToken
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
function PostFiles2(filenames) {
    return __awaiter(this, void 0, void 0, function* () {
        let attachments = new Array();
        let counter = 0;
        for (let index = 0; index < filenames.length; index++) {
            const fileName = filenames[index];
            console.log("work on file: " + Model.InputFolder + "\\" + fileName);
            //const readStream = await getStuff(Model.InputFolder + "\\" + fileName); //fs.createReadStream(Model.InputFolder + "\\" + fileName);
            const readStream = fs.readFileSync(Model.InputFolder + "\\" + fileName);
            counter++;
            console.log("files readed: " + counter);
            let attachment = yield PostFile2(fileName, readStream);
            console.log("file uploaded: " + attachment);
            attachments.push(attachment);
        }
        // filenames.forEach(async (fileName: string) => {
        //     console.log("work on file: " + Model.InputFolder + "\\" + fileName);
        //     //const readStream = await getStuff(Model.InputFolder + "\\" + fileName); //fs.createReadStream(Model.InputFolder + "\\" + fileName);
        //     const readStream = fs.readFileSync(Model.InputFolder + "\\" + fileName);
        //     counter++;
        //     console.log("files readed: " + counter);
        //     let attachment = await PostFile2(fileName, readStream);
        //     console.log("file uploaded: " + attachment);
        //     attachments.push(attachment);
        // });
        // while (counter > attachments.length) {
        // }
        console.log("Total uploaded: " + attachments.length);
        if (attachments.length > 0 && Model.InputEmail != "") {
            console.log("sending mail to: " + Model.InputEmail);
            console.log("subject: " + Model.InputSubject);
            console.log("body: " + Model.InputBody);
            if (Model.GroupedFiles) {
                SendMail(attachments);
            }
            else {
                attachments.forEach(attach => {
                    let attachment = new Array();
                    attachment.push(attach);
                    SendMail(attachment);
                });
            }
        }
    });
}
function PostFile2(fileName, fileBuffer) {
    return __awaiter(this, void 0, void 0, function* () {
        let attachment = "";
        console.log("try post file " + fileName + " to: " + Model.InputUrl + " pool: " + Model.InputPool + " token: " + Model.InputToken);
        try {
            const options = {
                'method': 'POST',
                'url': Model.InputUrl + "/attachments",
                'headers': {
                    "Authorization": Model.InputToken
                },
                formData: {
                    'pool_id': Model.InputPool,
                    '': {
                        "value": fileBuffer,
                        'options': {
                            'filename': fileName,
                            'contentType': 'multipart/form-data'
                        }
                    }
                }
            };
            let x = yield pushStuff(options);
            if (x.statusCode == 200) {
                console.log("Attachment Id: " + x.body);
                attachment = x.body;
                if (Model.InputDell)
                    DeleteFiles(fileName);
            }
            else {
                console.log("got an error: " + x.statusCode);
            }
            return attachment;
        }
        catch (err) {
            Model.AddMessage("faile to upload \n");
            console.log("error: " + err);
            return "";
        }
    });
}
