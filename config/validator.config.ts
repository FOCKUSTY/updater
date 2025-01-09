import type { Settings, SettingsKeys } from "./types.config";

import { join } from "path";
import { existsSync } from "fs";

enum Paths {
	node_dir = "node_modules",
	package_path = "package.json"
};

class Validator {
	private readonly _config: Settings;

	public constructor(config: Settings) {
		this._config = config;
	}

	private Error(key: SettingsKeys, data: { text?: string; error?: any }) {
		const value = this._config[key];

		const text = data.text ? `\n${data.text}` : "";
		const err = data.error ? `\n${data.error}` : "";

		throw new Error(
			`Error in config at key: "${key}". Your value: "${value}"${text}${err}`
		);
	}

	private async LinkValidator() {
		try {
			for (const lib of this._config.libs) {
				console.log(`link ${lib} is validating...`);

				fetch(`https://registry.npmjs.org/${lib}`).then((res) => {
					if (res.status !== 200) throw new Error(res.statusText);

					console.log(`link ${lib} is Ok!`);
				});
			}
		} catch (error) {
			this.Error("libs", { error });
		}
	}

	private PathValidator(dir: "node_dir"|"package_path", value: string) {
		try {
			console.log(Paths[dir] + " validating...");

			const path = join("./", value);
			const exists = existsSync(path);

			if (!exists)
				throw new Error("in key a path: " + value + " is not exists.");

			console.log(Paths[dir] + " is Ok!");
		} catch (error) {
			this.Error(dir, { error });
		}
	}

	public readonly init = async () => {
		await this.LinkValidator();
		
		this.PathValidator("node_dir", this._config.node_dir);
		this.PathValidator("package_path", this._config.package_path);
	};
}

export default Validator;
