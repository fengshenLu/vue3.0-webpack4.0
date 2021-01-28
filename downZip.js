const fileName = 'icon.zip'
const path = require('path')
const fs = require('fs')
const request = require('request');
const cookies = '' // iconfont 个人token
const url = 'https://www.iconfont.cn/api/project/download.zip?'
const dirPath = path.join('./src/assets');
const dirPaths = path.join('./src/assets')
const JsZip = require('jszip');
// 如遇问题可登陆www.iconfont.cn 登录后获取该网站cookies替换本脚本中cookies变量即可

function downIconZip() {
  let stream = fs.createWriteStream(path.join(dirPath, fileName));
  request({
    uri: url,
    method: 'GET',
    headers: {
      cookie:cookies,
    }
  }).on('response',response => {
    response.pipe(stream)
  }).on('end', (err, sss, code)=>{
    dealFiles()
  })
}
downIconZip()
function dealFiles(err) {
  fs.readFile(path.join(dirPath,fileName), function (err, data) {
    JsZip.loadAsync(data).then((file) => {
      for (let key in file.files) {
        if (!file.files[key].dir) {
          let name = file.files[key].name.split('/') || []
          if (name.length === 2) {
            file.files[key].async('nodebuffer').then(function (con) {
              fs.writeFileSync(path.join(dirPaths, name[1]), con)
              console.log(`生成${name[1]}文件成功`)
            })
          }
        }
      }
      // fs.unlink(path.join(dirPath,fileName), (err) => {
      //   if (err) throw err;
      // })
    })
  })
}

