import * as defaults from "./defaults"
import { Command, Prefix, RunningCommand } from "../contracts"
import formatDate from "date-fns/format"
import { reduce, escapeRegExp, get } from "lodash"
import * as chalk from "chalk";

export class Logger {
    private lastChar: string | undefined;

    constructor( 
        private outputStream: NodeJS.WritableStream,
        private prefixFormat?: Prefix | string, 
        private prefixLength: number = defaults.prefixLength, 
        private raw?: boolean, 
        private timestampFormat: string = defaults.timestampFormat
        ) {
    }

    shortenText(text: string) {
        if (!text || text.length <= this.prefixLength) {
            return text;
        }

        const ellipsis = '..';
        const prefixLength = this.prefixLength - ellipsis.length;
        const endLength = Math.floor(prefixLength / 2);
        const beginningLength = prefixLength - endLength;

        const beginnning = text.substring(0, beginningLength);
        const end = text.substring(text.length - endLength, text.length);
        return beginnning + ellipsis + end;
    }

    getPrefixesFor(command: RunningCommand): Record<Prefix, string> {
        return {
            none: '',
            pid: command.pid.toString(),
            index: command.index.toString(),
            name: command.name,
            command: this.shortenText(command.command),
            time: formatDate(Date.now(), this.timestampFormat)
        };
    }

    getPrefix(command: RunningCommand) {
        const prefix = this.prefixFormat || (command.name ? 'name' : 'index');
        if (prefix === 'none') {
            return '';
        }

        const prefixes = this.getPrefixesFor(command);
        if (Object.keys(prefixes).includes(prefix)) {
            return `[${(prefixes as any)[prefix]}]`;
        }

        return reduce(prefixes, (prev, val, key) => {
            const keyRegex = new RegExp(escapeRegExp(`{${key}}`), 'g');
            return prev.replace(keyRegex, val);
        }, prefix);
    }

    colorText(command: RunningCommand, text: string) {
        const color = get(chalk, command.prefixColor, chalk.gray.dim);
        return color(text);
    }

    logCommandEvent(text: string, command: RunningCommand) {
        if (this.raw) {
            return;
        }

        this.logCommandText(chalk.gray.dim(text) + '\n', command);
    }

    logCommandText(text: string, command: RunningCommand) {
        const prefix = this.colorText(command, this.getPrefix(command));
        return this.log(prefix + (prefix ? ' ' : ''), text);
    }

    logGlobalEvent(text: string) {
        if (this.raw) {
            return;
        }

        this.log(chalk.gray.dim('-->') + ' ', chalk.gray.dim(text) + '\n');
    }

    log(prefix: string, text: string) {
        if (this.raw) {
            return this.outputStream.write(text);
        }

        // #70 - replace some ANSI code that would impact clearing lines
        text = text.replace(/\u2026/g, '...');

        const lines = text.split('\n').map((line, index, lines) => {
            // First line will write prefix only if we finished the last write with a LF.
            // Last line won't write prefix because it should be empty.
            if (index === 0 || index === lines.length - 1) {
                return line;
            }
            return prefix + line;
        });

        if (!this.lastChar || this.lastChar === '\n') {
            this.outputStream.write(prefix);
        }

        this.lastChar = text[text.length - 1];
        this.outputStream.write(lines.join('\n'));
    }
};
