import path from "path";
import fs from "fs";

import tar from "tar-stream";
import zlib from "zlib";

class Unarchiver {
    private readonly _name: string;
    private readonly _path: string;

    public constructor(folder: string, name: string) {
        this._path = path.join(folder);
        this._name = name;
    }

    public execute() {
        const filePath = path.join(this._path, this._name);

        const extract = tar.extract();

        let data = "";

        extract.on("entry", (header, stream, cb) => {
            stream.on('data', (chunk) => {
                console.log(chunk, header);
            });
                
            stream.on('end', () => {
                cb();
            });

            stream.resume();
        });

        extract.on('finish', () => {
            fs.writeFileSync(this._name + ".tar", data);
        });

        fs.createReadStream(filePath)
            .pipe(zlib.createGunzip())
            .pipe(extract);
    }
}

export default Unarchiver;
