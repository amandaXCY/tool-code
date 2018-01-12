//https://github.com/facebook/react/blob/master/scripts/tasks/version-check.js
const gittags = require("git-tags")
const packVerson = require("./package.json").version
const chalk = require("chalk")
const Table = require("cli-table")
const path = require("path")
const log = console.log

//获取当项目最新的tag
async function getTagLatest(aPath) {
    return await new Promise(resolve => {
        let url
        if (!aPath || aPath == "./") {
            url = path.resolve("./")
            console.log(url)
        }
        gittags.latest(url, function(err, latest) {
            if (latest > packVerson || packVerson === latest) {
                log(chalk.green.bold(`最新版本为：${latest}`))
            }
            if (latest !== packVerson) {
                const table = new Table({
                    head: ["Package Version", "Tag Version"],
                })
                table.push([packVerson, latest])
                log(chalk.red("package.json的版本与tag版本不相同"))
                log(table.toString())
                resolve(latest)
            }
            resolve(latest)
        })
    })
}
module.exports = getTagLatest()
