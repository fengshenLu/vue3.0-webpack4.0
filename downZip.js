const fileName = 'icon.zip'
const path = require('path')
const fs = require('fs')
const request = require('request');
const cookies = 'cna=YfC7F/Y5CWICAXE5Vrdu1f6R; locale=zh-cn; EGG_SESS_ICONFONT=U8AXvqwdm-42-umGXGwgKq_Emj2wuVCkA87TjZ3dn6xm2T4whio3sIKoy4kjkuBSusLMQ-0MhcjWBE1FwhfGmMbpO9xPCEANAHIhoET_7kJ_pbscGV6FmfCh8QTWcmCiTv5lhhXEW-AxLfe1otCy-eI-zPgODc0D5EZxlVSk4mqOdEz-94IZi5OAcsu3pRkTAQs9KRTgwyfMtp67P9YXwDeVNoXPHTR1XHpaQgBHgWZxIoXczyxCXVtKz5kL3XUgvwp6JLe2wev9xkYzghiHas4vOSSS0td6rl63vNG5AbFfeFAx_UU3zY6r9v-rQ5tPMozf-Ps_-XrTrS7ngz8pxbHc7B8n2aaKiwwEZs7PDNP-pi0jYjEHlAk1lUO_rkvwh9nmqPoCjRugltJgvCX_jmkVfbcy0pSKlAjDBetRATozTz4gwtrGQXxwj2qMRq3-aTjiAF2uYOb4JGEW4G4zRe935-w9DMgmdK5Ob33SRoWoCVBt8Ehu7M87mlcD96C7czlErDQpTeJstGIcSdS40wcypo9SLY3f7c99z8rBJDxuJWOKnSu-5VSOK1zSNDG3l4pbKjVB8PSEiHXl7FDU67jPRowxGmCwW08w7tPwKL33oefimu4lcFVpV4EASEHU7U_lAb-VxrHMXaAnpu0iRCWXt0Y1bdERhbZJBMVNsUXYBo_y4pUlYk93v3NJlsBQ4O8rXX3Dm3TNf3e9eYuvurH3cmF5zN-CvmhHOLMoKMNLX2kkfFC6LXnN_RO1hEEVPBJESFLQw5KXFFoZrtWSpxTZvVBsgVpJEXA9q7i-p986LGW_oJWfxrf4M51sqGLPs5sOy_3pcm8UHLG474msMN5ysiS-Gz4E_snR_Z4AwE_U2pkPhWVbC7HKxfSq1U7kH8CKohzmWfckk_0gjZEyuji2nw7ja02Oq3gPb-DpVfLbu21LUjPKFSN22rxx1RCnFK5WQ3maaNEvBhinDxzMj6PNTTH0c1clGIjOckclFQx_yrjRypV5D7Ac62fm374No_bgixWdlM3fiZb9uEY0o-6mXcquyK19l2qz0Z1ct9394Hf58xJvE5BX-WpIXg7g; trace=AQAAAHdyNFt5YA0At1Y5caq8lCvXLPRy; ctoken=EFxxC6N_A4XgUowCaqGQuZgW; u=7850059; u.sig=ERYxx3VIeO9S9VkJSXHKgF8DtuYApbj6uGsAiEz2sV8; xlly_s=1; isg=BN7eZpMUDeuLB1nRIqK9qd4ML3Qgn6IZTil3dYhgEiEcq2yF9y7GKPBZpbenk5ox' // iconfont 个人token
const url = 'https://www.iconfont.cn/api/project/download.zip?spm=a313x.7781069.1998910419.d7543c303&pid=1793906'
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

