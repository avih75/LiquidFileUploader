import fs = require("fs");
import request = require("request");

export class LiquidFileUploader {
    private readonly InputPool: string;
    private readonly InputUrl: string;
    private readonly InputToken: string;
    private readonly InputEmails: string;
    private readonly InputAuth: boolean;
    private InputPrivat: string;
    private InputDays: string;
    private InputFolder: string;
    public FailMessage: string;

    constructor(inputUrl: string | undefined, inputToken: string | undefined, inputDays: string | undefined, inputFolder: string | undefined,
        inputPrivat: string | undefined, inputPool: string | undefined, inputEmails: string | undefined, inputAuth: boolean) {
        this.InputUrl = inputUrl || "";
        this.InputToken = "Basic " + inputToken || "";
        this.InputDays = inputDays || "";
        this.InputFolder = inputFolder || ""; 
        this.InputAuth = inputAuth || false;
        this.InputPrivat = inputPrivat || "";
        this.InputPool = inputPool || "";
        this.InputEmails = inputEmails || "";
        this.FailMessage = "";
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
    }
    Test(): boolean {
        let flag: boolean = true;
        console.log('Input paramters list:');
        this.FailMessage = "the faild checks";
        if (this.InputUrl == "")  // if leg
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
        }
        console.log('Auth selected: ', this.InputAuth);
        //this.GetList();
        return flag;
    }
    UploadTheFiles() {
        console.log("Look in to: " + this.InputFolder + " folder");
        fs.readdir(this.InputFolder, (err: any, filenames: string[]) => {
            if (filenames) {
                console.log("fonded: " + filenames);
                this.PostFiles(filenames);
            }
            else {
                this.FailMessage += "empty folder \n";
            }
        });
    }
    PostFiles(filenames: string[]) {
        let folder: string = this.InputFolder;
        let PostFile = this.PostTheFile;
        let url = this.InputUrl;
        let token = this.InputToken;
        let pool = this.InputPool;
        let days = this.InputDays;
        let email = this.InputEmails;
        let privFile = this.InputPrivat;
        filenames.forEach(function (fileName: string) {
            console.log("work on file: " + fileName);
            let fileBuffer: Buffer = Buffer.from(folder + fileName);
            console.log("try upload");
            PostFile(fileBuffer, fileName, url, token, pool, email, +days, privFile);
            console.log("file uploaded");
        });
    }
    PostTheFile(fileBuffer: Buffer, fileName: string, url: string, token: string, pool: string, email: string, days: number, privFile: String) {
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
                let expireDate: Date = new Date((new Date).getTime() + (1000 * 60 * 60 * 24) * days);
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
                    if (error) { throw new Error(error); }
                    else
                        console.log("respone off Mail: " + resp.body);
                });
            });
        } catch (err) {
            this.FailMessage += "faile to upload \n";
            console.log("error: " + err);
        }

    }
    GetList() { // get list of all pools and files in cluded - in case we need to get files
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
            } else {
                console.log("error: " + error);
            }
        });
    }
}