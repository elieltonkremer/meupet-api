const AbstractCommand = require('logos/Command/AbstractCommand')
const express = require('express');

class HttpServerCommand extends AbstractCommand {

    define_arguments(argument_parser) {
        argument_parser.add_argument('-p', '--port', {
            type: Number,
            default: 3001
        })
    }

    async execute() {
        let app = express()
        app.listen(this.argument.port)
        console.log('listening')
        return await new Promise(function(resolve) {
            ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
                'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
            ].forEach(function (sig) {
                process.on(sig, function() {
                    console.log('killing server')
                    process.exit()
                });
            });
        });
    }
}

module.exports = HttpServerCommand