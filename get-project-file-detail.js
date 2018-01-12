const http = require("http")
const util = require("./util")
const chalk = require("chalk")

const log = console.log

async function getFileDetail(id, filePath, branch) {
    var branch = branch || "master"
    const url = util.apiUrl(
        `/projects/${id}/repository/files`,
        "GET",
        `file_path=${filePath}&ref=${branch}`
    )
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
                let body = JSON.parse(buf.toString())

                resolve(body)
            })
        })
    })
}

module.exports = getFileDetail
