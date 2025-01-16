import { spawn } from "node:child_process";

class DependenciesManager {
    private readonly _name: string;

    public constructor(name: string) {
        this._name = name;
    }

    public execute() {
        const data = spawn(`cd .\\node_modules\\${this._name} && npm`, ["install"], { shell: true });
        
        data.stdout.on("error", (error) => {
            console.error("Error with library " + this._name + " try again or report a bug");
            throw new Error(error.message);
        });

        data.stdout.on("data", (data) => {
            console.log("Successfuly downloaded libraries for " + this._name);
            console.log(data.toString());
        });
    }
}

export default DependenciesManager;
