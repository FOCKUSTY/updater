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
		const libs = data.libs.split(",");

		new Configurator({
			libs: libs[0] === "" ? [] : libs,
			package_path: data.package_path,
			node_dir: data.node_dir
		});
	}
}

export default Command;
