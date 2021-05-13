const AbstractCommand = require('logos/Command/AbstractCommand')
const AbstractContext = require('logos/Context/AbstractContext')
const express = require('express');
const bodyParser = require('body-parser');

class HttpServerCommand extends AbstractCommand {

    /**
     * @param argument_parser
     * @param {AbstractContext} context
     */
    constructor(argument_parser, context) {
        super(argument_parser, context);
    }

    define_arguments(argument_parser) {
        argument_parser.add_argument('-p', '--port', {
            type: Number,
            default: 3001
        })
    }

    async execute() {
        const self = this;
        let app = express()
        app.use(bodyParser.json());
        app.listen(this.argument.port)
        app.route('/:handler').all(async function (request, response) {
            let context = new AbstractContext(self.context)
            return await context.with(null, async function(context) {
                return await context.get('app.http_handler').handle(request, response)
            })
        })
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