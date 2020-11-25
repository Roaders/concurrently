import { RunningCommand } from "../../contracts";
import { Logger } from "../logger";

export class LogOutput {
    constructor(private logger: Logger) {}

    handle(commands: RunningCommand[]) {
        commands.forEach(command => {
            command.stdout.subscribe(text => this.logger.logCommandText(text.toString(), command));
            command.stderr.subscribe(text => this.logger.logCommandText(text.toString(), command));
        });

        return commands;
    }
};
