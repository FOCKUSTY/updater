import Configurator from "../../index";

class Command {
	public execute(
		data: {
			config: boolean,
			package_path: string,
			node_dir: string,
			libs: string
		}
	) {
		if (data.libs.length === 0) return;

		new Configurator({
			libs: data.libs.split(","),
			package_path: data.package_path,
			node_dir: data.node_dir
		});
	}
}

export default Command;
