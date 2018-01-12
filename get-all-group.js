const http = require("http")
const util = require("./util")

//返回的是我加入的组，这是取决tooke的权限啊
async function getAllGroup() {
    const url = util.apiUrl("groups", "GET", "per_page=100")
    let chunks = []
    let size = 0

    return new Promise((resolve, reject) => {
        http.get(url, respone => {
            respone.on("data", res => {
                chunks.push(res)
                size += res.length
            })
            respone.on("end", res => {
                var buf = Buffer.concat(chunks, size)
                let body = buf.toString()

                resolve(eval("(" + body + ")"))
            })
        })
    })
}
module.exports = getAllGroup
