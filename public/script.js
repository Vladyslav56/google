let results = []

document.getElementById("form").addEventListener("submit", sendRequest)

async function sendRequest(e) {
	e.preventDefault()
	const keyword = document.getElementById("keyword").value
	const resultsBlock = document.getElementById("results")
	const download = document.getElementById("download")
	resultsBlock.innerHTML = "Searching..."
	download.style.display = "none"

	try {
		const response = await fetch("/search", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ keyword }),
		})
		if (response.ok) {
			results = await response.json()
			console.log(results)

			resultsBlock.innerHTML = results
				.map(
					(result) => `
				<div class='result'>
					<h3 class='title'>${result.title}</h3>
					<a href='${result.link}' class='link'>${result.link}</a>
				</div>
				`
				)
				.join("")

			download.style.display = "block"
			const resultsStr = JSON.stringify(results)
			const resultsURI =
				"data:application/json:charset=utf-8," + encodeURIComponent(resultsStr)
			download.href = resultsURI
		} else {
			resultsBlock.innerHTML = "error"
		}
	} catch (error) {
		console.error(error)
		resultsBlock.innerHTML = "error"
	}
}
