/* 此文件已被废弃，相应的方法已被 initDB.js 中的对应方法代替
 */
const path = require('path')
const fs = require('fs')
// markdown 这个包要指定到 .markdown
const md = require('markdown').markdown

// 获取各级标题
function getHeaders(mdString) {
	// 获取解析树
	var tree = md.parse(mdString)
	// 获取各级标题
	var headers = tree.filter((ele, index, arr) => {
		if (ele instanceof Array)
			return ele[0] === 'header'
	})
	// 到时页面中的分层目录的效果，就用 Vue 计算属性的得出缩进空格来表现
	return headers
}

// 遍历目录获取目录树，传入的路径需要是绝对路径
// 貌似 node 的 fs 不支持有关上级的相对路径
// 注意这里的所有 fs 操作都是异步的！
function getArticles(dirName, articles) {
	var order = 0
	// 返回文件列表
	fs.readdir(dirName, (err, files) => {
		if (err) {
			console.error('读取文件夹失败')
		} else {
			// 遍历当前文件夹下文件
			files.forEach( fileName => {
				var absPath = path.join(dirName, fileName)
				fs.stat(absPath, (erro, sta) => {
					if (erro) {
						console.error('获取文件状态失败')
					} else {
						// 是文件则存入 articles
						if (sta.isFile()) {
							var splitedDir = dirName.split('/')
							var bookName = splitedDir.pop()
							articles.push({
								'name' : fileName,
								'absPath' : absPath,
								'bookName' : bookName
							})
						// 否则递归
						} else {
							getArticles(absPath, articles)
						}
					}
				})
			})
		}
	})
	// 如果要实现最后一个项目递归完成即发送事件通知的话，要新设计计数机制
}

const url = '/home/maer/projects/PersonalBlogs/src/public/files/锋利的 JQuery/《锋利的 JQuery》第四章.md'
// 指定编码，否则无法解析中文
fs.readFile(url, 'utf-8', (err, data) => {
	var headers = getHeaders(data)
	console.log(headers)
})

/*
var articles = []
getArticles(path.resolve('../public/files'), articles)
// 因为异步的原因，暂时只能等个几秒再拿数据
setTimeout(() => { console.log(articles) }, 3000)
*/
