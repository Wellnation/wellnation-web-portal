import React from "react";
import { styled } from "@mui/material/styles";
import { Button, IconButton, Paper, Typography } from "@mui/material";
import Image from "next/image";
import { GitHub, LinkedIn } from "@mui/icons-material";

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: theme.palette.text.secondary,
	height: "100%",
}));

const members = [
	{
		name: "Piyush Mishra",
		github: "https://github.com/DarthSalad",
		linkedin: "https://www.linkedin.com/in/piyushmishra965/",
		image: "https://avatars.githubusercontent.com/u/75924053?v=4",
	},
	{
		name: "Saurav Pati",
		github: "https://github.com/oyesaurav",
		linkedin: "https://www.linkedin.com/in/oyesaurav/",
		image: "https://avatars.githubusercontent.com/u/78659500?v=4",
	},
	{
		name: "Shubhasai Mohapatra",
		github: "https://github.com/shubhasai",
		linkedin: "https://www.linkedin.com/in/shubhasai-mohapatra/",
		image: "https://avatars.githubusercontent.com/u/78340623?v=4",
	},
];

const Member = ({ name, github, linkedin, image }) => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				margin: "20px auto",
			}}
		>
			<Image
				style={{
					borderRadius: "50%",
				}}
				src={image}
				alt="Wellnation"
				width={200}
				height={200}
			/>
			<Typography
				variant="h6"
				style={{ textAlign: "center", fontWeight: "800" }}
				mt={2}
			>
				{name}
			</Typography>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					margin: "0 30px",
					justifyContent: "center",
				}}
			>
				<IconButton
					LinkComponent={"a"}
					style={{ fontSize: "1.8rem" }}
					href={github}
					target="_blank"
					referrerPolicy="no-referrer"
				>
					<GitHub htmlColor="black" fontSize="inherit" />
				</IconButton>

				<IconButton
					LinkComponent={"a"}
					style={{ fontSize: "1.8rem" }}
					href={linkedin}
					target="_blank"
					referrerPolicy="no-referrer"
				>
					<LinkedIn color="primary" fontSize="inherit" />
				</IconButton>
			</div>
		</div>
	);
};

const About = () => {
	return (
		<div
			style={{
				margin: "0 auto",
				padding: "50px 30px",
			}}
		>
			<Item
				style={{
					paddingBottom: "50px",
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						margin: "0 auto",
					}}
				>
					<Image
						src="https://raw.githubusercontent.com/Wellnation/.github/main/profile/wn.png"
						alt="Wellnation"
						width={200}
						height={200}
					/>
				</div>
				<Typography
					variant="h2"
					style={{ textAlign: "center", fontWeight: "400" }}
					mb={2}
				>
					Wellnation
				</Typography>
				<Typography variant="h6" style={{ textAlign: "center" }} mb={2}>
					Healthier you, happier world!
				</Typography>
				<div
					style={{
						padding: "0 50px",
					}}
				>
					<Typography
						variant="body1"
						style={{
							textAlign: "left",
							fontSize: "1.2rem",
						}}
						mb={2}
					>
						<b>WellNation</b> is a revolutionary platform that aims to bring
						transparency to the healthcare industry by connecting hospitals,
						service providers, users, and doctors with real-time data and
						information updates. The platform offers a comprehensive list of
						nearby hospitals, along with information about available doctors,
						tests, and rooms, making it easy for users to make informed
						decisions. Users can book appointments and tests through the app and
						access all relevant information about the availability of different
						services at all hospitals. <br />
						<br />
						The platform also features <b>WellBot</b>, a chatbot designed to
						answer all medical questions within the app, providing users with
						quick and reliable medical advice. In addition, WellNation features
						an emergency <b>SOS Alert</b> system that users can activate with
						just one click. By clicking the app widget, the user's location and
						information are shared with nearby hospitals and volunteers,
						ensuring rapid assistance during emergency situations. <br />
						<br />
						Overall, WellNation is an innovative healthcare application that
						simplifies the process of connecting with nearby hospitals while
						providing users with all necessary information related to medical
						issues. Its integration with WellBot and emergency SOS alert system
						make it a comprehensive healthcare solution that is essential for
						all individuals seeking medical attention.
					</Typography>
				</div>
				<div>
					<Typography
						variant="h4"
						style={{
							textAlign: "center",
							fontSize: "1.5rem",
							fontWeight: "bold",
							marginTop: "50px",
						}}
						mb={2}
					>
						Watch an introductory video of the platform
					</Typography>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							margin: "0 auto",
						}}
					>
						<iframe
							width="800px"
							height="400px"
							src="https://www.youtube.com/embed/t391I6rPHZk"
							title="Wellnation Introductory Video"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowFullScreen
							frameBorder={0}
						/>
					</div>
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						margin: "20px auto",
					}}
				>
					<Button
						LinkComponent={"a"}
						href="https://github.com/Wellnation"
						target="_blank"
						referrerPolicy="no-referrer"
						style={{
							fontSize: "1.2rem",
						}}
						variant="contained"
					>
						<GitHub
							htmlColor="white"
							fontSize="inherit"
							style={{
								marginRight: "10px",
							}}
						/>
						Go to the Github Repository
					</Button>
				</div>
				<div>
					<Typography
						variant="h4"
						style={{
							textAlign: "center",
							fontSize: "1.5rem",
							fontWeight: "bold",
							marginTop: "50px",
						}}
						mb={2}
					>
						Team Wellnation
					</Typography>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							margin: "0 auto",
						}}
					>
						{members.map((member) => (
							<Member {...member} />
						))}
					</div>
				</div>
			</Item>
		</div>
	);
};

export default About;
