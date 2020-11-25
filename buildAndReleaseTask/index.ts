import tl = require('azure-pipelines-task-lib/task');
import { LiquidFileUploader } from './LiquidFileUploader';

async function run() {
    try {
        let LiquidUploader: LiquidFileUploader = new LiquidFileUploader(tl.getInput('url', true), tl.getInput('token', true), tl.getInput('days', true),
            tl.getInput('folder', true), tl.getInput('private', true), tl.getInput('pool', true), tl.getInput('emails', true), tl.getBoolInput("useTasklib")
        );
        let flag: boolean = LiquidUploader.Test();
        if (flag) {
            console.log("");
            console.log('****************');
            console.log('* Start Script *');
            console.log('****************');
            console.log("");
            LiquidUploader.UploadTheFiles();
        }
        else {
            tl.setResult(tl.TaskResult.Failed, LiquidUploader.FailMessage);
            console.log('bad inputs', LiquidUploader.FailMessage);
        }
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();