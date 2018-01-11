//https://github.com/facebook/react/blob/master/scripts/tasks/version-check.js
const gittags = require("git-tags")
const packVerson = require("./package.json").version

async function getTagLatest(params) {
    return await new Promise(resolve => {
        gittags.latest("./", function(err, latest) {
            resolve(latest)
        })
    })
}

getTagLatest().then(res => {
    console.log(res)
})
