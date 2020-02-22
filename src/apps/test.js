const fs = require('fs')
const path = require('path')
const md = require('markdown').markdown
const sqlite3 = require('sqlite3')

const filesDir = path.resolve('../public/files')
const dbUrl = path.resolve('../databases/blogs.db')
const classes = [{name: '学习笔记'}, {name: '生活记录'}]

// 同步方式获取书籍清单
function getBooksSync(absPath) {
	return fs.readdirSync(absPath).map(fname => {
		return {
			name: fname,
			className: classes[0].name
		}
	})
}

// 同步方式获取文章清单
function getArticlesSync(absDir) {
	// 文章数组
	var articles = []
	// 文件夹队列
	var dirs = [absDir]
	while (dirs.length > 0) {
		var dir = dirs.shift()
		var files = fs.readdirSync(dir)
		files.forEach( fname => {
			var absPath = path.join(dir, fname)
			var sta = fs.statSync(absPath)
			// 如果是文件则推入文章数组
			if (sta.isFile()) {
				var splitedDir = dir.split('/')
				var bookName = splitedDir.pop()
				articles.push({
					'name': fname,
					'absPath': absPath,
					'bookName': bookName
				})
			// 否则推入文件夹队列
			} else {
				dirs.push(absPath)
			}
		})
	}
	return articles
}

// 同步方式获取文章标题
function getHeadersSync(absPath) {
	var article = fs.readFileSync(absPath, 'utf-8')
	var tree = md.parse(article)
	var articleName = absPath.split('/').pop().split('.')[0]
	// 过滤出标题
	var headers = tree.filter( ele => {
		if (ele instanceof Array)
			return ele[0] === 'header'
	})
	// 转化成对象数组
	var headers = headers.map( ele => {
		return { 
			name: ele[2], 
			level: ele[1].level,
			'articleName': articleName
		}
	})
	return headers
}

var books = getBooksSync(filesDir)
var articles = getArticlesSync(filesDir)
var headers = articles.reduce((prev, cur) => {
	// 如果 prev 是数组，直接拼接
	if (prev instanceof Array)
		return prev.concat(getHeadersSync(cur.absPath))
	// 否则先获取标题数组再拼接
	else
		return getHeadersSync(prev.absPath).concat(getHeadersSync(cur.absPath))
})

// 新建数据库链接
var db = new sqlite3.Database(dbUrl)

/*
// 插入分类表数据
classes.forEach(cla => {
	db.run('INSERT INTO classes (name) VALUES (?)', cla.name)
})
*/

/* 出现查询不到 className 对应 id 的情况有可能是查询时分类表数据未完成插入 */
/* 但这不符合逻辑，分类表中都有好几条 class 了。 */

/* 有没有可能查询语句出错了? */
/* 查询语句的语法没有问题，否则先报错的是 Syntax Error。 */

/* 在出现了 [Error: SQLITE_RANGE: column index out of range] 后，根据相应 Github Issues 
 * 把参数改为固定查询语句后，取消查询参数，就可以正常出结果。
 * 由此推测是参数替换的过程有问题
 */

/* 查明原因了，如果参数是字符串，那不必在查询语句中加双引号，否则查询不到对应结果。*/

// 插入书籍表数据
books.forEach(book => {
	let sqlRequest = 'SELECT id FROM classes WHERE name = ?'
	let sqlParams = [book.className] 
	db.get(sqlRequest, sqlParams, (err, data) => {
		if (err)
			throw err
		console.log(`book.className: ${book.className}, data: ${data}`)
		// db.run('INSERT INTO books (name, class) VALUES (?, ?)', book.name, data.id)
	})
})

/*
// 插入文章表数据
articles.forEach(article => {
	db.get("SELECT id FROM books WHERE name LIKE '?'", article.bookName, (err, data) => {
		console.log(`book data: ${data}`)
		db.run('INSERT INTO articles (name, path, book) VALUES (?, ?, ?)', article.name, article.absPath, data.id)
	})
})

// 插入标题表数据
headers.forEach(header => {
	db.get("SELECT id FROM articles WHERE name LIKE '?'", header.articleName, (err, data) => {
		db.run('INSERT INTO headers (name, level, article) VALUES (?, ?, ?)', header.name, header.level, data.id)
	})
})
*/
