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
		// corresbonding books 获取对应书籍
		corBooks: function(cla) {
			if (this.books != null)
				return this.books.filter(b => {
					return b['class'] == cla.id
				})
		},
		// corresbonding articles 获取对应文章
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
		// 由于暂时不知如何从后端在发回文件同时发回附带文章 ID
		// 故暂且从 URL 获取
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
			var articleElement = document.querySelector("article")
			articleElement.innerHTML = marked(res.data)
			// 筛选 HTML 标题
			var hs = articleElement.querySelectorAll('h1, h2, h3, h4, h5, h6')
			// 建立标题名到标题的映射对象，降低目录标题到文章标题映射处理的时间复杂度
			var hso = {}
			hs.forEach(h => {
				hso[h.textContent] = h
			})

			// 获取指定文章对应标题
			axios.get('/getArticleHeaders/' + articleId).then(res => {
				this.headers = res.data
				this.headers.forEach(h => {
					hso[h.name].id = 'header' + h.id
				})
			})
		})
	}
})
