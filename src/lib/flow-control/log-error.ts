import { RunningCommand } from "../../contracts";
import { Logger } from "../logger";

export class LogError {
    constructor(private logger: Logger) {}

    handle(commands: RunningCommand[]) {
        commands.forEach(command => command.error.subscribe(event => {
            this.logger.logCommandEvent(
                `Error occurred when executing command: ${command.command}`,
                command
            );

            this.logger.logCommandEvent(typeof event == "string" ? event : event.stack, command);
        }));

        return commands;
    }
};
