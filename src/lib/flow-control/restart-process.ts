import { SchedulerLike, merge } from "rxjs";
import { defaultIfEmpty, delay, filter, mapTo, skip, take, takeWhile } from "rxjs/operators"
import { RunningCommand } from "../../contracts";
import { restartDelay, restartTries } from "../defaults"
import { Logger } from "../logger";

export class RestartProcess {
    constructor(
        private logger: Logger, 
        private delay: number = restartDelay, 
        private tries: number = restartTries,  
        private scheduler?: SchedulerLike
        ) {
    }

    handle(commands: RunningCommand[]) {
        if (this.tries === 0) {
            return commands;
        }

        commands.map(command => command.close.pipe(
            take(this.tries),
            takeWhile(({ exitCode }) => exitCode !== 0)
        )).map((failure, index) => merge(
            // Delay the emission (so that the restarts happen on time),
            // explicitly telling the subscriber that a restart is needed
            failure.pipe(delay(this.delay, this.scheduler), mapTo(true)),
            // Skip the first N emissions (as these would be duplicates of the above),
            // meaning it will be empty because of success, or failed all N times,
            // and no more restarts should be attempted.
            failure.pipe(skip(this.tries), mapTo(false), defaultIfEmpty(false))
        ).subscribe(restart => {
            const command = commands[index];
            if (restart) {
                this.logger.logCommandEvent(`${command.command} restarted`, command);
                command.start();
            }
        }));

        return commands.map(command => {
            const closeStream = command.close.pipe(filter(({ exitCode }, emission) => {
                // We let all success codes pass, and failures only after restarting won't happen again
                return exitCode === 0 || emission >= this.tries;
            }));

            return new Proxy(command, {
                get(target, prop) {
                    return prop === 'close' ? closeStream : (target as any)[prop];
                }
            });
        });
    }
};
