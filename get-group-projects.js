const http = require("http")
const util = require("./util")
const getAllGroup = require("./get-all-group")
const chalk = require("chalk")

const log = console.log
let pageTotal = 1
let pageSize = 20
let total = 0
let allProject = []
let groupName
let groupInfo

async function getGroupProjects(name) {
    groupName = name
    if (!groupName || groupName == "") {
        log(chalk.red(`输入GroupName`))
        process.exit(1)
    }

    const allGroup = await getAllGroup()
    groupInfo = await searchGroupName(allGroup, groupName)

    if (!groupInfo) {
        log(chalk.red(`找不到${groupName}`))
        process.exit(1)
    }

    await getProjects(1)

    if (pageTotal > 1) {
        await getAllProjects()
    }

    log(chalk.green(`Project Total: ${allProject.length} `))

    return new Promise((resolve, reject) => {
        resolve(allProject)
    })
}

async function searchGroupName(all, name) {
    return Promise.resolve(
        all.find(item => {
            return item.name == name
        })
    )
}

//获取第1页项目，拿到总页数和总项目数
async function getProjects(pageIndex) {
    const url = util.apiUrl(
        `groups/${groupInfo.id}/projects`,
        "GET",
        `per_page=${pageSize}&page=${pageIndex}`
    )
    let chunks = []
    let size = 0

    return new Promise((resolve, reject) => {
        http.get(url, respone => {
            pageTotal = respone.headers["x-total-pages"]
            total = respone.headers["x-total"]
            respone.on("data", res => {
                chunks.push(res)
                size += res.length
            })
            respone.on("end", res => {
                var buf = Buffer.concat(chunks, size)
                let body = JSON.parse(buf.toString())
                allProject = allProject.concat(body)

                resolve(body)
            })
        })
    })
}

//根据pageTotal获取所有的
async function getAllProjects() {
    for (var i = 2; i <= pageTotal; i++) {
        await getProjects(i)
    }
}

module.exports = getGroupProjects
