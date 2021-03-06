import fs = require("fs");
import util = require("util");
import { delay } from "q";
import request = require("request");

let Model: LiquidFileUploader;
const readFile = util.promisify(fs.createReadStream);
const postFilee = util.promisify(request);
function getStuff(path: string) {
    return readFile(path, undefined);
}
function pushStuff(options: any) {
    return postFilee(options);
}
export class LiquidFileUploader {
    public readonly InputPool: string;
    public readonly InputUrl: string;
    public readonly InputToken: string;
    public readonly InputEmail: string;
    public readonly InputAuth: boolean;
    public readonly GroupedFiles: boolean;
    public readonly InputDell: boolean;
    public InputPrivat: string;
    public InputDays: string;
    public InputFolder: string;
    public InputSubject: string;
    public InputBody: string;
    public Message: string;

    constructor(inputUrl: string | undefined, inputToken: string | undefined, inputDays: string | undefined,
        inputFolder: string | undefined, inputPrivat: string | undefined, inputPool: string | undefined,
        inputEmail: string | undefined, inputSubject: string | undefined, inputBody: string | undefined,
        groupedFiles: boolean, inputDell: boolean, inputAuth: boolean) {
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
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
    }
    AddMessage(message: string) {
        this.Message += message + "\n";
        console.log('Test Message: ' + message);
    }
    Test(): boolean {
        let flag: boolean = true;
        console.log('Input paramters list:');
        this.AddMessage("the faild checks");
        if (this.InputUrl == "")  // if leg
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
            this.InputDays = "3"
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
            this.InputBody = "file was sented to you by LiquidFile Task"
        }
        else {
            console.log('email: ', this.InputBody);
        }
        if (this.InputSubject == "") {
            this.AddMessage("no Body ....add default string")
            this.InputSubject = "LiquidFile Task Auto mail"
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
export function UploadTheFiles() {
    console.log("Look in to: " + Model.InputFolder + " folder");
    fs.readdir(Model.InputFolder, async (err: any, filenames: string[]) => {
        if (filenames) {
            console.log("fonded: " + filenames);
            await PostFiles2(filenames);
        }
        else {
            Model.AddMessage("empty folder \n");
        }
    });
}
async function PostFiles(filenames: string[]) {
    let attachments: Array<string> = new Array<string>();
    let counter: number = 0;
    filenames.forEach(async function (fileName: string) {
        console.log("work on file: " + Model.InputFolder + "\\" + fileName);
        const readStream = fs.createReadStream(Model.InputFolder + "\\" + fileName);
        console.log("file content: " + readStream);
        console.log("try upload");
        PostFile(readStream, fileName, attachments);
        console.log("file uploaded");
        counter++;
    });
    let x = 0;
    while (counter > attachments.length) {
        while (attachments.length > x) {
            console.log("uploaded: " + x + " of total: " + counter);
            x++;
        }
        await delay(1000);
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
                let attachment: Array<string> = new Array<string>();
                attachment.push(attach);
                SendMail(attachment);
            });
        }
    }
}
function PostFile(fileBuffer: fs.ReadStream, fileName: string, attachments: Array<string>) {
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
        let x: string = ".";
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
    } catch (err) {
        Model.AddMessage("faile to upload \n");
        console.log("error: " + err);
        return ""
    }
}
function SendMail(attachments: Array<string>) {
    let expireDate: Date = new Date((new Date).getTime() + (1000 * 60 * 60 * 24) * +Model.InputDays);
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
        if (error) { throw new Error(error); }
        else
            console.log("respone off Mail: " + resp.body);
    });
}
function DeleteFiles(filename: string) {
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
        } else {
            console.log("error: " + error);
        }
    });
}
async function PostFiles2(filenames: string[]) {
    let attachments: Array<string> = new Array<string>();
    let counter = 0;
    for (let index = 0; index < filenames.length; index++) {
        const fileName = filenames[index];
        console.log("work on file: " + Model.InputFolder + "\\" + fileName); 
        const readStream = fs.readFileSync(Model.InputFolder + "\\" + fileName);
        counter++;
        console.log("files readed: " + counter);
        let attachment = await PostFile2(fileName, readStream);
        console.log("file uploaded: " + attachment);
        attachments.push(attachment);
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
                let attachment: Array<string> = new Array<string>();
                attachment.push(attach);
                SendMail(attachment);
            });
        }
    }
}
async function PostFile2(fileName: string, fileBuffer: unknown) {
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
        let x = await pushStuff(options);
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
    } catch (err) {
        Model.AddMessage("faile to upload \n");
        console.log("error: " + err);
        return ""
    }
}