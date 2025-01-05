import { Settings } from "../types";
import Configurator from "../../index";

class Command {
	public execute(data: Settings & { libs: string }) {
		data.libs = JSON.parse(JSON.stringify(`["${data.libs}"]`, undefined, 4));

		if (data.libs.length === 0) return;

		new Configurator({
			libs: JSON.parse(data.libs),
			node_dir: data.node_dir
		});
	}
}

export default Command;
