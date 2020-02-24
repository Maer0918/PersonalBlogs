var express = require('express');
var router = express.Router();
const path = require('path')
const sqlite3 = require('sqlite3')
const fs = require('fs')

/* database url */
const dbUrl = path.resolve('databases/blogs.db')

/* GET home page. */
router.get('/', function(req, res, next) {
	res.sendFile(path.resolve('views/index.html'))
})

/* GET classes */
router.get('/getClasses', (req, res, next) => {
	var db = new sqlite3.Database(dbUrl)
	db.all('SELECT * FROM classes', (err, result) => {
		res.json(result)
	})
	db.close()
})

/* GET books */
router.get('/getBooks', (req, res, next) => {
	var db = new sqlite3.Database(dbUrl)
	db.all('SELECT * FROM books', (err, result) => {
		res.json(result)
	})
	db.close()
})

/* GET articles */
router.get('/getArticles', (req, res, next) => {
	var db = new sqlite3.Database(dbUrl)
	db.all('SELECT * FROM articles', (err, result) => {
		res.json(result)
	})
	db.close()
})

/* GET artilce page */
router.get('/article/:id', (req, res, next) => {
	res.sendFile(path.resolve('views/content.html'))
})

/* GET article MD */
router.get('/getArticleMD/:id', (req, res, next) => {
	var db = new sqlite3.Database(dbUrl)
	db.get('SELECT path FROM articles WHERE id = ?', parseInt(req.params.id), (err, result) => {
		fs.readFile(result.path, 'utf-8', (err, fl) => {
			res.send(fl)
		})
	})
	db.close()
})

/* GET article headers */
router.get('/getArticleHeaders/:id', (req, res, next) => {
	var db = new sqlite3.Database(dbUrl)
	db.all('SELECT * FROM headers WHERE article = ?', parseInt(req.params.id), (err, result) => {
		res.json(result)
	})
})

module.exports = router;
