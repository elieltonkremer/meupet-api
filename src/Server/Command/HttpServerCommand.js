const AbstractCommand = require('logos/Command/AbstractCommand')
const AbstractContext = require('logos/Context/AbstractContext')
const RuntimeContext = require('logos/Context/RuntimeContext');
const express = require('express')
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')
const nodemailer = require('nodemailer')
const cors = require('cors')

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
        app.use(cors())
        app.listen(this.argument.port)
        app.route(/^\/*/).all(async function (request, response) {
            console.log(request.method, request.path);
            let client = new MongoClient('mongodb://localhost:27017/')
            let runtime = {}
            let context = new RuntimeContext(self.context, runtime)
            return await context.with(null, async function(context) {
                try {
                    await client.connect()
                    runtime['app.persistence'] = client.db('tcc')
                    runtime['app.mailer'] = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.EMAIL_USER || 'tcc.senai.mailer@gmail.com' ,
                            pass: process.env.EMAIL_PASSWORD || "10101023"
                        }
                    })
                    return await context.get('app.http_handler').handle(request, response)
                } finally {
                    await  client.close()
                }
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
