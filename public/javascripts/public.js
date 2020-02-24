/* 全局组件注册要在挂载 Vue 实例之前 */
Vue.component('navi', {
	props: ['classes', 'books'],
	template: `
	<div>
		<div class="dropdown" v-for="cla in classes">
			<a class="dropbtn" :href="'#class'+cla.id">{{ cla.name }}</a>
			<div class="dropdown-content">
				<a v-for="book in corBooks(books, cla)" :href="'#book'+book.id">{{ book.name }}</a>
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

