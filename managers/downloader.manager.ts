import Unarchiver from "./unarchiver.manager";

import https from "https";
import fs from "fs";

class Downloader {
    private readonly _url: string;
    private readonly _name: string;

    public constructor(url: string, name: string) {
        this._url = url;
        this._name = name;
    }

    public execute() {
        const file = fs.createWriteStream(this._name + ".tgz");
        
        https.get(this._url, (res) => {
            console.log("downloading...");
            res.pipe(file);

            file.on("finish", () => {
                console.log("downloaded!");
                file.close();

                new Unarchiver("./", this._name).execute();
            });
        });
    }
}

export default Downloader;
