import NpmApi from "npm-api";
import Repo from "npm-api/lib/models/repo";

import type {
    Settings,
    SettingsKeys
} from "./types.config";

const npm = new NpmApi();

class Validator {
    private readonly _config: Settings;

    public constructor(config: Settings) {
        this._config = config;
    
        this.init();
    }

    private Error(text: string, key: SettingsKeys, err?: any) {
        const value = this._config[key];

        throw new Error(`Error in config at "${key}". Your value: "${value}"\n${text}${err ? `\n${err}` : ""}`);
    }

    private async LinkValidator() {
        try {
            const res = await fetch(`https://registry.npmjs.org/${this._config.name}`);
            const repo = await res.json(); 
            const { version } = await new Repo(this._config.name).version("latest");

            console.log(repo.versions[version]);
        } catch (err) {
            this.Error("", "name", err);
        }
    }

    private PathValidator() {

    }

    private readonly init = () => {
        this.LinkValidator();
    };
};

(() => {
    new Validator({
        name: "f-formatter",
        node_dir: "./node_modules/"
    });
})();

export default Validator;