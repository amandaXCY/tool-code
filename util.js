const constants = require("./constants")
const apiUrl = function(url, type, options) {
    //type:get
    const api = "http://gitlab.beisencorp.com/api/v3/"
    const private_token = constants.private_token

    let params = options || ""
    if (type === "GET") {
        return api + url + "?private_token=" + private_token + "&" + params
    }
    return api + url
}

module.exports = {
    apiUrl,
}
