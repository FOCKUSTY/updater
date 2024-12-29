import type {
    Settings,
    SettingsKeys
} from "./types.config";

import path from "path";
import fs from "fs";

class Validator {
    private readonly _config: Settings;

    public constructor(config: Settings) {
        this._config = config;
    }

    private Error(key: SettingsKeys, data: { text?: string, error?: any}) {
        const value = this._config[key];

        const text = data.text ? `\n${data.text}` : "";
        const err = data.error ? `\n${data.error}` : "";

        throw new Error(`Error in config at "${key}". Your value: "${value}"${text}${err}`);
    }

    private async LinkValidator() {
        try {
            for (const lib of this._config.libs) {
                console.log(`link ${lib} is validating...`);

                fetch(`https://registry.npmjs.org/${lib}`).then((res) => {
                    if (res.status !== 200)
                        throw new Error(res.statusText);

                    console.log(`link ${lib} is Ok!`);
                });
            };

        } catch (error) {
            this.Error("libs", { error });
        }
    }

    private PathValidator() {
        try {
            console.log("node_modules validating...");

            const node_modules_path = path.join("./", this._config.node_dir);
            const node_modules = fs.existsSync(node_modules_path);
            
            if (!node_modules)
                throw new Error("dir at" + this._config.node_dir + " is not exists.");
            
            console.log("node_modules is Ok!");
        } catch (error) {
            this.Error("node_dir", { error });
        }
    }

    public readonly init = async () => {
        await this.LinkValidator();
        this.PathValidator();
    };
};

export default Validator;
