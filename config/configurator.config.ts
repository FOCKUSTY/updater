import Validator from "./validator.config";
import Downloader from "../managers/downloader.manager";
import type { Settings } from "./types.config";

import Repo from "npm-api/lib/models/repo";

import path from "path";
import fs from "fs";

class Configurator {
    private readonly _config?: Settings;

	public constructor(config?: Settings) {
        this._config = config;
		this.init();
	}

	private readonly ReadConfig = (): Settings => {
		if (this._config)
            return this._config;

        const config_path = path.join("./", ".upcfg");

		if (!fs.existsSync(config_path))
			throw new Error(
				'config is not exists\nconfig must be on root dir with name ".upcfg".'
			);

		const file = fs.readFileSync(config_path, "utf-8");
		const config: Settings = JSON.parse(file);

		return config;
	};

	private readonly Load = async (config: Settings) => {
		for (const lib of config.libs) {
			const repoResponse = await fetch(`https://registry.npmjs.org/${lib}`);

			const repo = await repoResponse.json();
			const { version } = await new Repo(lib).version("latest");

			const url = repo.versions[version].dist.tarball;

			new Downloader(url, lib, config.node_dir).execute();
		}
	};

	private readonly init = async () => {
		const config = this.ReadConfig();

		await new Validator(config).init();

		await this.Load(config);
	};
}

(() => {
	new Configurator();
})();

export default Configurator;
