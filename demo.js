const http = require("http")
var url = "http://gitlab.beisencorp.com/api/v3/"
//var url = "http://gitlab.beisencorp.com/"
//var token = "?private_token=EH1JyzJzhMUR-i7h8NPx"
var token =
    "?private_token=G5-kdHCQUgeT3sGWm8st&file_path=package.json&ref=master"

//获取项目id;
//var token = "?private_token=G5-kdHCQUgeT3sGWm8st&search=ux-okr" //

var path = `${url}projects/889/repository/files${token}`
var path = `http://gitlab.beisencorp.com/api/v3/groups/?per_page=100&private_token=G5-kdHCQUgeT3sGWm8st`
console.log(path)
http.get(path, respone => {
    let body
    respone.on("data", res => {
        body += res
    })
    respone.on("end", () => {
        console.log(body)
    })
})
