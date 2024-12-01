const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")

const app = express()
app.use(express.json())
app.use(express.static("public"))

app.post("/search", async (req, res) => {
	const { keyword } = req.body
	if (!keyword) {
		return res.status(400).json({ error: "Keyword is required" })
	}
	try {
		const response = await axios.get(
			`https://www.google.com/search?q=${encodeURIComponent(keyword)}&hl=en`,
			{
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
				},
			}
		)

		const $ = cheerio.load(response.data)

		const results = []
		$(".yuRUbf").each((i, el) => {
			const title = $(el).find("h3").text()
			const link = $(el).find("a").attr("href")

			results.push({ title, link })
		})

		res.json(results)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Keyword is required" })
	}
})

app.listen(3000, () => {
	console.log("Server started on port 3000")
})
