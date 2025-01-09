import { Settings } from "../types";

import { join } from "path";
import { existsSync, writeFileSync } from "fs";

class Command {
	public execute(data: Settings) {
		const path = join("./", ".upcfg");

		if (existsSync(path)) return;

		writeFileSync(
			path,
			JSON.stringify(
				{
					package_path: "./package.json",
					node_dir: "./node_modules",
					libs: []
				},
				undefined,
				4
			)
		);
	}
}

export default Command;
