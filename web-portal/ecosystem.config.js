module.exports = {
	apps: [
		{
			script: "npm start",
		},
	],

	deploy: {
		production: {
			key: "wellnation.pub",
			user: "wellnation",
			host: "35.232.243.162",
			ref: "origin/master",
			repo: "GIT_REPOSITORY",
			path: "DESTINATION_PATH",
			"pre-deploy-local": "",
			"post-deploy":
				"npm install && pm2 reload ecosystem.config.js --env production",
			"pre-setup": "",
		},
	},
};
