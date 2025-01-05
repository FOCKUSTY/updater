import { Settings } from "../types";

import { join } from "path";
import { writeFileSync } from "fs";

class Command {
	public execute(data: Settings) {
		const path = join("./", ".upcfg");

		writeFileSync(
			path,
			JSON.stringify(
				{
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
