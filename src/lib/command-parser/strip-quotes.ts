import { Command } from "../../contracts"

export class StripQuotes {
    public parse(commandInfo: Command) {
        let { command } = commandInfo;

        // Removes the quotes surrounding a command.
        if (/^"(.+?)"$/.test(command) || /^'(.+?)'$/.test(command)) {
            command = command.substr(1, command.length - 2);
        }

        return Object.assign({}, commandInfo, { command });
    }
};
