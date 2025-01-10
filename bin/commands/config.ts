import { join } from "path";
import { writeFileSync } from "fs";

class Command {
	public async execute() {
		const path = join("./", ".upcfg");

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
