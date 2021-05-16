const StringDataType = require("logos-schema/DataType/StringDataType")
const ValidationError = require("logos-schema/DataType/ValidationError")


class EmailDataType extends StringDataType {

  async toJS(data, configuration) {
      try {
        return await super.toJS(data, {
          ...configuration,
          pattern: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        })
      } catch (e) {
        if (e instanceof ValidationError && e.message.includes('pattern')) {
          throw new ValidationError('Invalid email')
        }
        throw e
      }
  }
}

module.exports = EmailDataType
