#!/usr/bin/env node
import yargs from "yargs";

import path from "path";
import fs from "fs";

import ConfigCommand from "./commands/config";

import type { AllOptions, Command, Options, Key, Settings } from "./types";

const usage = '\nUsage: fockupdater update --libs "a,b,c" to update';

const keys: Key[] = ["config", "libs", "node_dir", "package_path"];

const options: AllOptions<Options> = {
	"package_path": {
		name: "P",
		alias: "package_path",
		describe: "path of package.json",
		boolean: false,
		default: "./package.json"
	},
	"node_dir": {
		name: "D",
		alias: "node_dir",
		describe: "dir of node_modules",
		boolean: false,
		default: "./node_modules"
	},
	"libs": {
		name: "L",
		alias: "libs",
		describe: "your libs to update",
		boolean: false,
		default: ""
	},
	"config": {
		name: "c",
		alias: "config",
		describe: "config create",
		boolean: true,
		default: false
	}
};

const settings: any = yargs
	.usage(usage)
	.version()
	.command("update", "start updating", (argv) => {
		argv
			.option(options.package_path.name, options.package_path)
			.option(options.libs.name, options.libs)
			.option(options.node_dir.name, options.node_dir);

		return argv;
	})
	.option(options.config.name, options.config)
	.parse();


class Listener {
	private readonly options: Settings = {
		package_path: options.package_path.default,
		config: options.config.default,
		node_dir: options.node_dir.default,
		libs: options.libs.default
	};

	public constructor() {
		this.init();
	}

	private readonly init = () => {
		for (const key of keys) {
			(this.options as any)[key] = settings[key]
		};

		this.execute();
	};

	private readonly execute = () => {
		const folderPath = path.join(__dirname, "commands");
		const folder = fs.readdirSync(folderPath);

		if (this.options.config) {
			return new ConfigCommand().execute();
		}

		for (const fileName of folder) {
			const filePath = path.join(folderPath, fileName);
			const name = path.parse(filePath).name as Key;

			if (name === "config") continue;

			const command: Command = new (require(`${filePath}`).default)();

			command.execute(this.options);
		}
	};
}

(() => {
	new Listener();
})();
