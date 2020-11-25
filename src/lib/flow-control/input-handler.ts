import { fromEvent } from "rxjs";
import { map } from "rxjs/operators"
import { Command, RunningCommand } from "../../contracts";
import { defaultInputTarget  } from "../defaults"
import { Logger } from "../logger";

export class InputHandler {
    constructor(
        private logger: Logger,
        private inputTarget: number = defaultInputTarget, 
        private inputStream?: NodeJS.ReadableStream, 
        ) {
    }

    handle(commands: RunningCommand[]) {
        if (!this.inputStream) {
            return commands;
        }

        fromEvent(this.inputStream, 'data')
            .pipe(map((data: any) => data.toString()))
            .subscribe(data => {
                let [targetId, input] = data.split(':', 2);
                targetId = input ? targetId : this.inputTarget;
                input = input || data;

                const command = commands.find(command => (
                    command.name === targetId ||
                    command.index.toString() === targetId.toString()
                ));

                if (command && command.stdin) {
                    command.stdin.write(input);
                } else {
                    this.logger.logGlobalEvent(`Unable to find command ${targetId}, or it has no stdin open\n`);
                }
            });

        return commands;
    }
};
