/** @flow */
import type Command from './command';   
import defaultHandleError from './default-error-handler';

const commander = require('commander');

export default class CommandRegistrar {
  version: string;
  usage: string;
  description: string;
  commands: Command[];

  registerBaseCommand() {
    commander
      .version(this.version)
      .usage(this.usage)
      .description(this.description);
  }

  constructor(usage: string, description: string, version: string, commands: Command[]) {
    this.usage = usage;
    this.description = description;
    this.version = version;
    this.commands = commands;
  }

  registerCommands() {
    function register(command: Command) {
      commander
        .command(command.name)
        .description(command.description)
        .alias(command.alias)
        .action((...args) => {
          command.action(args)
            .then(data => console.log(command.report(data)))
            .catch((err) => {
              const errorHandled = defaultHandleError(err) || command.handleError(err);
              if (errorHandled) console.log(errorHandled);
              else console.error(err);
            });
        });
    }
    
    this.commands.forEach(register);
  } 

  outputError() {
    
  }

  outputHelp() {
    if (!process.argv.slice(2).length) {
      commander.help();
    }

    return this;
  } 

  errorHandler(err: Error) {
    console.error(err);
  }
  
  run() {
    this.registerBaseCommand();
    this.registerCommands();
    commander.parse(process.argv);
    this.outputHelp();

    return this;
  }
}
