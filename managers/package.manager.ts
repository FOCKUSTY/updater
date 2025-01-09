import { join } from "path";
import { Settings } from "../config/types.config";
import { readFileSync, writeFileSync } from "fs";

class PackageManager {
    private readonly _config: Settings;

    public constructor(config: Settings) {
        this._config = config;
    }

    private readonly ReadFile = () => {
        const path: string = join(this._config.package_path);

        try {
            const file: string = readFileSync(path, "utf-8");
            const json: { [key: string]: any } = JSON.parse(file);

            return json;
        } catch (error: any) {
            throw new Error(error);
        }
    };

    private readonly Updater = (
        json: {[key: string]: any} & {
            dependencies: {[key: string]: string},
            devDependencies: {[key: string]: string}
        },
        lib: string,
        version: string
    ) => {
        if (!json.dependencies)
            json.dependencies = {};
        if (!json.devDependencies)
            json.devDependencies = {};

        const type: "devDependencies"|"dependencies" = json.devDependencies[lib]
            ? "devDependencies"
            : "dependencies";
      
        json[type][lib] = version;

        writeFileSync(this._config.package_path, JSON.stringify(json, undefined, 2), "utf-8");
    };

    public readonly execute = (lib: string, version: string) => {
        const json: any = this.ReadFile();
        
        this.Updater(json, lib, version);
    }
}

export default PackageManager;
