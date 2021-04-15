const { ApplicationContext } = require("logos")

const app = new ApplicationContext([
    'logos/Command',
    'logos-schema',
    "./Server",
    "./Authentication"
])

const command = app.get('app.command')
command.execute()

