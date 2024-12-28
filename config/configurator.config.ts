import Validator from "./validator.config";
import type { Settings } from "./types.config";

import https from "https";

import tar from 'tar-stream';
import zlib from 'zlib';

import NpmApi from "npm-api";
import Repo from "npm-api/lib/models/repo";

import path from "path";
import fs from "fs";

class Configurator {
    public constructor() {
        this.init();
    }

    private readonly ReadConfig = (): Settings => {
        const config_path = path.join("./", ".upcfg");
        
        if (!fs.existsSync(config_path))
            throw new Error("config is not exists\nconfig must be on root dir with name \".upcfg\".");

        const file = fs.readFileSync(config_path, "utf-8");
        const config: Settings = JSON.parse(file);

        return config;
    };

    private readonly Unzip = (config: Settings) => {
        const fileName = config.name + ".tgz";
        const filePath = path.join("./", fileName)

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
            fs.writeFileSync(config.name + ".tar", data);
        });

        fs.createReadStream(filePath)
            .pipe(zlib.createGunzip())
            .pipe(extract);
    };

    private readonly Load = async (config: Settings) => {
        const repoResponse = await fetch(`https://registry.npmjs.org/${config.name}`);
        
        const repo = await repoResponse.json(); 
        const { version } = await new Repo(config.name).version("latest");

        const fileName = config.name + ".tgz"
        const file = fs.createWriteStream(fileName);

        const downloadUrl = repo.versions[version].dist.tarball;
        
        https.get(downloadUrl, (res) => {
            console.log("downloading...");
            res.pipe(file);

            file.on("finish", () => {
                console.log("downloaded!");
                file.close();

                this.Unzip(config);
            });
        });
    };

    private readonly init = async () => {
        const config = this.ReadConfig();

        await new Validator(config).init();

        await this.Load(config);
    };
};

(() => {
    new Configurator();
})();

export default Configurator;
