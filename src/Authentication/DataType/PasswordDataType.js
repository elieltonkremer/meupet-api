const StringDataType = require("logos-schema/DataType/StringDataType")
const ValidationError = require("logos-schema/DataType/ValidationError")
const crypto = require('crypto')


class PasswordDataType extends StringDataType {

    async toJS(data, configuration) {
        if (typeof data === "string") {
            let hash = crypto.createHmac('sha512', configuration.application_id);
            hash.update(data)
            if (data > 8 && data !== hash.digest('hex'))
                new ValidationError('Incorrect password')
            return hash.digest()
        }
        throw new ValidationError('Invalid password')
    }

    async toJSON(data, configuration) {
        return super.toJSON(data, configuration)
    }
}

module.exports = PasswordDataType