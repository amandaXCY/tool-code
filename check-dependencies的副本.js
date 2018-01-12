//检查所有依赖些组件的项目

const http = require("http")
const cheerio = require("cheerio")
const json = require("request-promise-json")
const chalk = require("chalk")
const Table = require("cli-table")
const log = console.log

let checkName, table
let allProjectNames = []
let errProjectName = []
const dependedProject = []
const depTabel = []
let depTabelIndex = 0

function getOnePage(pageIndex) {
    return new Promise((resolve, reject) => {
        http.get(
            {
                host: "gitlab.beisencorp.com",
                path: `/groups/ux-cnpm?page=${pageIndex}`,
            },
            response => {
                let body = ""
                response.on("data", res => {
                    body += res
                })
                response.on("end", res => {
                    try {
                        if (!body || body == "") {
                            reject("此项目为空")
                        }
                        const $ = cheerio.load(body)
                        getPageComponent($)
                        resolve($)
                        return
                    } catch (err) {
                        reject(err)
                    }
                })
            }
        )
    })
}

//获取pageTotal
async function getPageTotal($) {
    const href = $(".pagination .last a").attr("href")
    const idx = href.indexOf("page=")
    pageTotal = href.slice(idx + 5)
    return await pageTotal
}
//获取所有项目
function getPageComponent($) {
    const projectsNode = $(".projects-list .project")
    //去掉/ux-cnpm/
    projectsNode.each(function() {
        var href = $(this)
            .attr("href")
            .slice(9)
        allProjectNames.push(href)
    })
}

//创建队列，获取所有的项目
async function getAllComponent(pageTotal) {
    var pond = []
    for (var i = 1; i < pageTotal; i++) {
        pond.push(getOnePage(i))
    }
    return await Promise.all(pond)
}

//获取dependencie
async function getJSON(name) {
    // var url = `http://gitlab.beisencorp.com/ux-cnpm/${name}/raw/master/package.json`
    // return json.get(url)
    // log(name)
    return await new Promise((resolve, reject) => {
        var url = `http://gitlab.beisencorp.com/ux-cnpm/${name}/raw/master/package.json`
        var url = `http://gitlab.beisencorp.com/projects/ux-react-loader/access_requests?private-token=_3ypMd8dKyLt5BAHSMY_`
        json
            .get(url)
            .then(data => {
                log(data)
                macthDependName(data)
                resolve(data)
            })
            .fail(err => {
                resolve(err)
            })
    })
}

//获取被依赖的项目名称
function macthDependName(data) {
    let depName = checkName
    let name =
        data.name.indexOf("@beisen") > -1 ? data.name.substr(8) : data.name
    let version

    if (data.dependencies["@beisen/" + depName]) {
        version = data.dependencies["@beisen/" + depName]
        ++depTabelIndex
        table.push([depTabelIndex, name, version])
    }

    if (data.devDependencies["@beisen/" + depName]) {
        version = data.devDependencies["@beisen/" + depName]
        ++depTabelIndex
        table.push([depTabelIndex, name, version])
    }
}

async function searchDepend() {
    for (var i = 1; i < allProjectNames.length; i++) {
        await getJSON(allProjectNames[i])
    }
}
async function check() {
    const argv = process.argv
    checkName = argv[argv.length - 1]

    if (checkName.indexOf("/") !== -1) {
        log(
            chalk.red(
                "wrong: you must enter : npm run check-dependencies CompanentName"
            )
        )
        process.exit(1)
    }
    table = new Table({
        head: ["number", "Component", `${checkName} version`],
    })

    const pageBody = await getOnePage(1)
    const pageTotal = await getPageTotal(pageBody)
    await getAllComponent(pageTotal)

    await searchDepend()
    logTable()
}

//列出有被依赖组件版本号与之不同的组件，如果相同不会被列出
function logTable() {
    console.log('Your server available at http://localhost:3000"')
    log(chalk.green("seach total:" + allProjectNames.length))
    log(table.toString())
}

module.exports = check()
//module.exports = check("tool-tip")
