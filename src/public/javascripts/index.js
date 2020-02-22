var app = new Vue({
	el: 'body',
	data: {
		classes: null,
		books: null,
		aritcles: null
	},
	created: function () {
		// 获取分类
		axios.get('/getClasses').then(res => {
			// res.json() 的返回数据在 data 里面
			// res.send() 的返回数据在 body 里面
			this.classes = res.data
		})
		// 获取书籍
		axios.get('getBooks').then(res => {
			this.books = res.data
		})
		// 获取文章
		axios.get('getArticles').then(res => {
			this.articles = res.data
		})
	}
})
