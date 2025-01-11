import Validator from "./validator.config";
import Downloader from "../managers/downloader.manager";
import PackageManager from "../managers/package.manager";
import type { Settings } from "./types.config";

import Repo from "npm-api/lib/models/repo";

import path from "path";
import fs from "fs";

class Configurator {
	private readonly _config?: Settings;
	private readonly _load: boolean;

	public constructor(config?: Settings, load: boolean=true) {
		this._config = config;
		this._load = load;

		this.init();
	}

	private readonly ReadConfig = (): Settings => {
		if (this._config && this._config.libs.length !== 0)
			return this._config;

		const config_path = path.join("./", ".upcfg");

		if (!fs.existsSync(config_path))
			throw new Error(
				'config is not exists\nconfig must be on root dir with name ".upcfg".'
			);

		const file = fs.readFileSync(config_path, "utf-8");
		const config: Settings = JSON.parse(file);

		if (this._config && this._config.libs.length === 0)
			return {
				...this._config,
				libs: config.libs,
			};

		return config;
	};

	private readonly Load = async (config: Settings) => {
		if (config.libs.length === 0)
			return;
		
		for (const lib of config.libs) {
			const repoResponse = await fetch(`https://registry.npmjs.org/${lib}`);

			const repo = await repoResponse.json();
			const { version } = await new Repo(lib).version("latest");

			const url = repo.versions[version].dist.tarball;

			if (!this.UpdatePackage(lib, version))
				continue;

			new Downloader(url, lib, config.node_dir).execute();
		}
	};

	private readonly UpdatePackage = (name: string, version: string) => {
		return new PackageManager(this.config).execute(name, version);
	};

	private readonly init = async () => {
		const config = this.ReadConfig();

		await new Validator(config).init();

		if (this._load) await this.Load(config);
	};

	get config(): Settings {
		return this._config || this.ReadConfig();
	}
}

export default Configurator;
