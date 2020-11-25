import { RunningCommand } from "../../contracts";
import { Logger } from "../logger";

export class LogExit {
    constructor(private logger: Logger) {}

    handle(commands: RunningCommand[]) {
        commands.forEach(command => command.close.subscribe(({ exitCode }) => {
            this.logger.logCommandEvent(`${command.command} exited with code ${exitCode}`, command);
        }));

        return commands;
    }
};
