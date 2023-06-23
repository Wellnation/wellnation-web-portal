module.exports = {
	apps: [
		{
      script: "npm start",
      env: {
        "NEXT_PUBLIC_FIREBASE_API_KEY": "AIzaSyAj4ZrCjW4dadI3C3NqThB8PoYYEf74B6Q",
        "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "wellnation-cc1b2.firebaseapp.com",
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "wellnation-cc1b2",
        "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET": "wellnation-cc1b2.appspot.com",
        "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "311280251000",
        "NEXT_PUBLIC_FIREBASE_APP_ID": "1:311280251000:web:7dd143d1dd4d48b0993d8d",
        "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID": "G-3X5JZR2CW6",
        "NEXT_PUBLIC_FIREBASE_VAPID_KEY": "BKIAhdxklewjAc294u-S6ny64gx2ivyWoeTDmiTE_XamlFqlILjyxmYJCAT3VIwJeDzd7YYZhUU0_1i9WRvfZZc",
        "NEXT_PUBLIC_GOOGLE_MAPS_KEY": "AIzaSyAOjr36nWK1pfruFvU8w49Pb_BKZSmWlYk",
        "NEXT_PUBLIC_VIDEOSDK_API_KEY": "0128bf9c-1372-437b-b57f-9053ee2781ef",
        "NEXT_PUBLIC_VIDEOSDK_TOKEN": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI2YTk4YmU1NS1iNTFlLTRkZmEtYWI1My1lMmUxYzcwNjIzNWIiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY4NjcyNDY2MiwiZXhwIjoxNzE4MjYwNjYyfQ.A_ZdT6l4he-GIgna_NoLPhmdx-IZ8t5afgk3ksURJGY",
      }
		},
	],

	deploy: {
		production: {
			key: "wellnation.pem",
			user: "wellnation",
			host: "35.232.243.162",
			ref: "origin/main",
			repo: "git@github.com:Wellnation/wellnation-web-portal.git",
			path: "/home/wellnation",
			// "pre-deploy-local": "cd web-portal",
			"post-deploy":
				"source ~/.nvm/nvm.sh && cd web-portal && npm install && npm run build && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
      "ssh_options": "ForwardAgent=yes",
		},
	},
};
