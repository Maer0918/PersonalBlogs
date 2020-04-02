var app = new Vue({
	el: '#app',
	data: {
		classes: null,
		books: null,
		articles: null
	},
	methods: {
		corBooks: function(cla) {
			if (this.books != null)
				return this.books.filter(b => {
					return b['class'] == cla.id
				})
		},
		corArticles: function(book) {
			if (this.articles != null)
				return this.articles.filter(a => {
					return a['book'] == book.id
				})
		}
	},
	created: function () {
		// 获取分类
		axios.get('/getClasses').then(res => {
			// res.json() 的返回数据在 data 里面
			// res.send() 的返回数据在 body 里面
			this.classes = res.data
		})
		// 获取书籍
		axios.get('/getBooks').then(res => {
			this.books = res.data
		})
		// 获取文章
		axios.get('/getArticles').then(res => {
			this.articles = res.data
		})
	}
})
