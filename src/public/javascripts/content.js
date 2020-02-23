/* 全局组件注册要在挂载 Vue 实例之前 */
Vue.component('navi', {
	props: ['classes', 'books'],
	template: `
	<div>
		<div class="dropdown" v-for="cla in classes">
			<a class="dropbtn" :href="'/#class'+cla.id">{{ cla.name }}</a>
			<div class="dropdown-content">
				<a v-for="book in corBooks(books, cla)" :href="'/#book'+book.id">{{ book.name }}</a>
			</div>
		</div>
	</div>
	`,
	methods: {
		corBooks: function(books, cl) {
			return books.filter(b => {
				return b['class'] == cl.id
			})
		}
	}
})

var app = new Vue({
	el: '#app',
	data: {
		classes: null,
		books: null,
		articles: null,
		articleHTML: null,
		articleMD: null,
		headers: null
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
		},
		sameClassArticles: function(artID) {
			if (this.artilces != null) {
				console.log('sameClassArticles')
				var art = this.articles.filter(a => {
					return a.id === artID
				})
				art = art[0]
				return this.articles.filter(a => {
					return a['book'] == art['book']
				})
			}
		}
	},
	computed: {
		articleID: function () {
			return parseInt(document.URL.split('/').pop())
		}
	},
	created: function () {
		// 获取文章 ID
		var articleId = parseInt(document.URL.split('/').pop())

		// 获取分类
		axios.get('/getClasses').then(res => {
			// res.json() 的返回数据在 data 里面；res.send() 的返回数据在 body 里面
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

		// 获取指定文章 Markdown
		axios.get('/getArticleMD/' + articleId).then(res => {
			this.articleMD = res.data
			// 更新文章内容
			document.querySelector("article").innerHTML = marked(res.data)
		})

		// 获取指定文章对应标题
		axios.get('/getArticleHeaders/' + articleId).then(res => {
			this.headers = res.data
		})
	}
})
