const gittags = require("git-tags")

gittags.get("/..", function(err, tags) {
    console.log(tags)
})
