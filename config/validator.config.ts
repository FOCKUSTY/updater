import type { Settings, SettingsKeys } from "./types.config";

import { join } from "path";
import { existsSync } from "fs";

enum Paths {
	node_dir = "node_modules",
	package_path = "package.json"
};

class Validator {
	private readonly _config: Settings;
	private readonly _logging: boolean;

	public constructor(config: Settings, logging: boolean = true) {
		this._logging = logging;
		this._config = config;
	}

	private Error(key: SettingsKeys, data: { text?: string; error?: any }) {
		const value = this._config[key];

		const text = data.text ? `\n${data.text}` : "";
		const err = data.error ? `\n${data.error}` : "";

		throw new Error(
			`Error in config at key: "${key}". Your value: "${value}"${text}${err}`
		)
	}

	private async LinkValidator() {
		try {
			for (const lib of this._config.libs) {
				if (lib === "") return false;
				
				if (this._logging) console.log(`link ${lib} is validating...`);

				fetch(`https://registry.npmjs.org/${lib}`).then((res) => {
					if (res.status !== 200) throw new Error(res.statusText);

					if (this._logging) console.log(`link ${lib} is Ok!`);
				});
			}

			return true;
		} catch (error) {
			if (this._logging) {
				this.Error("libs", { error })
				return false;
			} else return false;
		}
	}

	private PathValidator(dir: "node_dir"|"package_path", value: string): boolean {
		try {
			if (this._logging) console.log(Paths[dir] + " validating...");

			const path = join("./", value);
			const exists = existsSync(path);

			if (!exists && this._logging)
				throw new Error("in key a path: " + value + " is not exists.");
			else if (!this._logging)
				return false;
			else {
				if (this._logging) console.log(Paths[dir] + " is Ok!");
				return true;
			}
		} catch (error) {
			if (this._logging) {
				this.Error(dir, { error })
				return false; 
			} else return false;
		}
	}

	public readonly init = async () => {
		if (await this.LinkValidator()) return false;
		
		if (this.PathValidator("node_dir", this._config.node_dir)) return false;
		if (this.PathValidator("package_path", this._config.package_path)) return false;

		return true;
	};
}

export default Validator;
