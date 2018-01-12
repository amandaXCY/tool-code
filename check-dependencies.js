const http = require("http")
const util = require("./util")
const getGroupProjects = require("./get-group-projects")
const getProjectFileDetail = require("./get-project-file-detail")
const chalk = require("chalk")
const Table = require("cli-table")

const log = console.log
let logTable
let logIndex = 0
let dependName
//dependName：被依赖的项目名字 ,groupName： 组的名字
async function checkDependencies(name, groupName) {
    dependName = name
    log(dependName)
    logTable = new Table({
        head: ["number", "Component", `${dependName} version`],
    })
    const allProjects = await getGroupProjects(groupName)

    await loopAll(allProjects)
}

async function loopAll(allProjects) {
    //allProjects.splice(1)

    for (var i = 0; i < allProjects.length; i++) {
        var item = allProjects[i]
        const itemInfo = await getProjectFileDetail(
            item.id,
            "package.json",
            "master"
        )
        const content = itemInfo.content
        if (content) {
            await matchJSON(content)
        } else {
            log(item.name)
        }
    }
    console.log(logTable.toString())
    return new Promise((resolve, reject) => {
        resolve()
    })
}

async function matchJSON(content) {
    return await new Promise((resolve, reject) => {
        let json = new Buffer(content, "base64").toString()
        json = JSON.parse(json)
        var name = json.name
        if (name.indexOf("/") !== -1) {
            name = name.slice(name.indexOf("/") + 1)
        }

        if (json.dependencies && json.dependencies[dependName]) {
            ++logIndex
            var version = json.dependencies[dependName]
            logTable.push([logIndex, name, version])
        }
        if (json.devDependencies && json.devDependencies[dependName]) {
            ++logIndex
            var version = json.devDependencies[dependName]
            logTable.push([logIndex, name, version])
        }
        if (json.peerDependencies && json.peerDependencies[dependName]) {
            ++logIndex
            var version = json.peerDependencies[dependName]
            logTable.push([logIndex, name, version])
        }
        resolve()
    })
}

checkDependencies("@beisen/tool-tip", "ux-cnpm")
