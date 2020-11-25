import { Command } from "../../contracts"

export class ExpandNpmShortcut {
    public parse(commandInfo: Command) {
        const [, npmCmd, cmdName, args] = commandInfo.command.match(/^(npm|yarn|pnpm):(\S+)(.*)/) || [];
        if (!cmdName) {
            return commandInfo;
        }

        return Object.assign({}, commandInfo, {
            name: commandInfo.name || cmdName,
            command: `${npmCmd} run ${cmdName}${args}`
        });
    }
};
