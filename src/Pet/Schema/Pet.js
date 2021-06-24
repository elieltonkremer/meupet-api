module.exports = {
    properties: {
        user: {
            type: "string",
            required: true
        },
        type: {
            type: "string",
            required: true,
            choices: [
                "dog",
                "cat",
                "fish",
                "rabbit"
            ]
        },
        breed: {
            type: "string",
            required: true
        },
        name: {
            type: "string",
            required: true
        },
        birthday: {
            type: "date",
            required: true,
            format: "DD/MM/YYYY"
        },
        lost: {
            type: "boolean",
            required: true,
            default: function() {
                return false;
            }
        }
    }
}