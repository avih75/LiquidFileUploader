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
const tl = require("azure-pipelines-task-lib/task");
const LiquidFileUploader_1 = require("./LiquidFileUploader");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let LiquidUploader = new LiquidFileUploader_1.LiquidFileUploader(tl.getInput('url', true), tl.getInput('token', true), tl.getInput('days', true), tl.getInput('folder', true), tl.getInput('private', true), tl.getInput('pool', true), tl.getInput('email', true), tl.getInput('subject', true), tl.getInput('body', true), tl.getBoolInput("group", true), tl.getBoolInput("dell", true), tl.getBoolInput("auth", true));
            let flag = LiquidUploader.Test();
            if (flag) {
                console.log("");
                console.log('****************');
                console.log('* Start Script *');
                console.log('****************');
                console.log("");
                LiquidFileUploader_1.UploadTheFiles();
            }
            else {
                tl.setResult(tl.TaskResult.Failed, LiquidUploader.Message);
                console.log('bad inputs', LiquidUploader.Message);
            }
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
