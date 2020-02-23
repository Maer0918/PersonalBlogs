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
				var aName = fname.split('.')
				aName.pop()
				aName = aName.join('.')
				articles.push({
					'name': aName,
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
	var articleName = absPath.split('/').pop().split('.')
	articleName.pop()
	articleName = articleName.join('.')
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

// 初始化数据库
const initSqlUrl = path.resolve('../databases/blogs.sql')
const initSql = fs.readFileSync(initSqlUrl, 'utf-8')
var initDb = () => {
	return new Promise((resolve, reject) => {
		db.exec(initSql, err => {
			if (err) throw err
			else resolve()
		})
	})
}

// 插入分类表数据
var initClasses = () => {
	return new Promise((resolve, reject) => {
		classes.forEach(cla => {
			db.run('INSERT INTO classes (name) VALUES (?)', cla.name, err => {
				if (err) throw err
				else resolve()
			})
		})
	})
}

// 插入书籍表数据
var initBooks = () => {
	return new Promise((resolve, reject) => {
		books.forEach(book => {
			db.get("SELECT id FROM classes WHERE name LIKE ?", book.className, (err, data) => {
				if (err) {
					throw err
				} else {
					// console.log(`book.name: ${book.name}, data.id: ${data.id}`)
					db.run('INSERT INTO books (name, class) VALUES (?, ?)', book.name, data.id, error => {
						if (error) throw error
						else resolve()
					})
				}
			})
		})
	})
}

// 插入文章表数据
var initArticles = () => {
	return new Promise((resolve, reject) => {
		var count = 0
		articles.forEach(article => {
			db.get("SELECT id FROM books WHERE name LIKE ?", article.bookName, (err, data) => {
				if (err) {
					throw err
				} else {
					console.log(`count/length: ${count++}/${articles.length-1} article.name: ${article.name} article.absPath: ${article.absPath} article.bookName: ${article.bookName} book data.id: ${data.id}`)
					db.run('INSERT INTO articles (name, path, book) VALUES (?, ?, ?)', article.name, article.absPath, data.id, error => {
						if (error) throw error
						else resolve()
					})
				}
			})
		})
	})
}

// 插入标题表数据
var initHeaders = () => {
	return new Promise((resolve, reject) => {
		var count = 0
		headers.forEach(header => {
			db.get("SELECT id FROM articles WHERE name LIKE ?", header.articleName, (err, data) => {
				if (err) {
					throw err
				} else {
					console.log(`count/length ${count++}/${headers.length-1} headers.name: ${header.name} header.arcticleName: ${header.articleName} data.id: `)
					db.run('INSERT INTO headers (name, level, article) VALUES (?, ?, ?)', header.name, header.level, data.id, error => {
						if (error) throw error
						else resolve()
					})
				}
			})
		})
	})
}

// 链式执行异步操作
initDb().then(initClasses)
	.then(initBooks)
	.then(initArticles)
	.then(initHeaders)

db.close()
