
import { Command, Options } from "./contracts"
import { Logger, InputHandler, LogError, LogExit, LogOutput, KillOnSignal, KillOthers, RestartProcess, concurrently } from "./lib"

module.exports = (commands: (Command | string)[], options: Options = {}) => {
    const logger = new Logger(
        options.outputStream || process.stdout,
        options.prefix,
        options.prefixLength,
        options.raw,
        options.timestampFormat,
    );

    return concurrently(commands, {
        maxProcesses: options.maxProcesses,
        raw: options.raw,
        successCondition: options.successCondition,
        controllers: [
            new LogError(logger),
            new LogOutput(logger),
            new LogExit(logger),
            new InputHandler(
                logger,
                options.defaultInputTarget,
                options.inputStream,
            ),
            new KillOnSignal(process),
            new RestartProcess(
                logger,
                options.restartDelay,
                options.restartTries,
            ),
            new KillOthers(
                logger,
                options.killOthers,
            )
        ]
    });
};

// Export all flow controllers and the main concurrently function,
// so that 3rd-parties can use them however they want
exports.concurrently = concurrently;
exports.Logger = Logger;
exports.InputHandler = InputHandler;
exports.KillOnSignal = KillOnSignal;
exports.KillOthers = KillOthers;
exports.LogError = LogError;
exports.LogExit = LogExit;
exports.LogOutput = LogOutput;
exports.RestartProcess = RestartProcess;
