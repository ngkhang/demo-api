const PORT = process.env.DOMAIN || 8000;
const express = require("express");
// const cors = require("cors");
const axios = require("axios");
const INPUT = "london";
const url = require("url");
require("dotenv").config();
const app = express();

const rateLimit = require("express-rate-limit");
const TIME = 15;
const MAX = 10;
const limiter = rateLimit({
	windowMs: TIME * 60 * 1000, // minutes
	max: MAX, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
});
app.use(limiter);
app.set("trust proxy", 1);

app.use(express.static("public"));

// Routes
app.route("/weather").get((req, res) => {
	const API_BASE_URL = process.env.API_BASE_URL;
	const API_KEY_NAME = process.env.API_KEY_NAME;
	const API_KEY = process.env.API_KEY;

	const params = new URLSearchParams({
		[API_KEY_NAME]: API_KEY,
		...url.parse(req.url, true).query,
	});
	console.log(params);

	const options = {
		methods: "GET",
		url: `${API_BASE_URL}?${params}`,
		// url: `${URL}?q=${INPUT}?${params}`,
		// https://api.openweathermap.org/data/2.5/weather?q=london&appid=
		headers: {
			"x-api-key": process.env.API_KEY,
		},
	};
	axios
		.request(options)
		.then((response) => res.json(response.data))
		.catch((error) => console.log(error));
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
