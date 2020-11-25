/**
 * This file is meant to be a shared place for default configs.
 * It's read by the flow controllers, the executable, etc.
 *
 * Refer to tests for the meaning of the different possible values.
 */

export const defaultInputTarget = 0;
    // Whether process.stdin should be forwarded to child processes
export const handleInput = false;
    // How many processes to run at once
export const maxProcesses = 0;
export const nameSeparator = ',';
    // Which prefix style to use when logging processes output.
export const prefix = '';
    // Refer to https://www.npmjs.com/package/chalk
export const prefixColors = 'gray.dim';
    // How many bytes we'll show on the command prefix
export const prefixLength = 10;
export const raw = false;
    // Number of attempts of restarting a process, if it exits with non-0 code
export const restartTries = 0;
    // How many milliseconds concurrently should wait before restarting a process.
export const restartDelay = 0;
    // Condition of success for concurrently itself.
export const success = 'all';
    // Refer to https://date-fns.org/v2.0.1/docs/format
export const timestampFormat = 'yyyy-MM-dd HH:mm:ss.SSS';

