var p1 = (value) => {
	return new Promise((resolve, reject) => {
		console.log(++value)
		resolve(value)
	})
}

var p2 = (value) => {
	return new Promise((resolve, reject) => {
		console.log(++value)
		resolve(value)
	})
}

var p3 = (value) => {
	return new Promise((resolve, reject) => {
		console.log(++value)
		resolve(value)
	})
}

p1(0).then(p2).then(p3)
