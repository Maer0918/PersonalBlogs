var express = require('express');
var router = express.Router();
const path = require('path')
const sqlite3 = require('sqlite3')

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

module.exports = router;
