import { Observable } from "rxjs";

export interface Command {
    command: string;
    env?: NodeJS.ProcessEnv;
    name?: string;
    prefixColor?: string;
}

export interface RunningCommand extends Required<Command> {
    pid: number,
    index: number,
    stdin?: NodeJS.WritableStream,
    stdout: Observable<Object>,
    stderr: Observable<Object>,
    close: Observable<{exitCode: number}>,
    error: Observable<{stack: string} | string>,
    killable: boolean;
    kill: (signal?: string) => void;
    start: () => void;
}

export type Prefix = 'index' | 'pid' | 'time' | 'command' | 'name' | 'none';
export type KillOtherConditions = 'success' | 'failure';

export interface Options {
    /** the default input target when reading from `inputStream`. Default: `0`. */
    defaultInputTarget?: number;
    /** a Readable stream to read the input from, eg `process.stdin` */
    inputStream?: NodeJS.ReadableStream;
    /** an array of exiting conditions that will cause a process to kill others. Can contain any of success or failure. */
    killOthers?: KillOtherConditions[];
    /**
     * how many processes should run at once
     * @default 0
     */
    maxProcesses?: number;
    /**  a Writable stream to write logs to. Default: `process.stdout` */
    outputStream?: NodeJS.WritableStream;
    /**
     * the prefix type to use when logging processes output.
     */
    prefix?: Prefix | string;
    /** how many characters to show when prefixing with `command`. Default: `10` */
    prefixLength?: number;
    /** whether raw mode should be used, meaning strictly process output will be logged, without any prefixes, colouring or extra stuff. */
    raw?: boolean;
    /** the condition to consider the run was successful. */
    successCondition?: 'first' | 'last';
    /** how many attempts to restart a process that dies will be made. Default: `0` */
    restartTries?: number;
    /** how many milliseconds to wait between process restarts. Default: 0 */
    restartDelay?: number;
    /** a date-fns format to use when prefixing with time. Default: `yyyy-MM-dd HH:mm:ss.ZZZ` */
    timestampFormat?: string;
}