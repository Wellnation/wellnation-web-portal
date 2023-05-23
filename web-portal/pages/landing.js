import React from "react";
import {
	Header,
	Container,
	Group,
	Burger,
	Paper,
	Transition,
	rem,
	Title,
	MantineProvider,
	List,
	ActionIcon,
	Button,
	Image,
	Text,
	Accordion,
	Grid,
	Col,
	TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useStyles } from "@/components/landing.styles";
import {
	CheckCircle,
	Twitter,
	Instagram,
	YouTube,
	GitHub,
} from "@mui/icons-material";

const HEADER_HEIGHT = rem(60);
const links = [
	{ label: "About", link: "#about" },
	{ label: "Screenshots", link: "#screenshots" },
	{ label: "Features", link: "#features" },
	{ label: "FAQ", link: "#faq" },
	{ label: "Contact Us", link: "#contact-us" },
];

const data = [
	{
		title: "About",
		links: [
			{ label: "Features", link: "#" },
			{ label: "Pricing", link: "#" },
			{ label: "Support", link: "#" },
			{ label: "Forums", link: "#" },
		],
	},
	{
		title: "Project",
		links: [
			{ label: "Contribute", link: "#" },
			{ label: "Media assets", link: "#" },
			{ label: "Changelog", link: "#" },
			{ label: "Releases", link: "#" },
		],
	},
	{
		title: "Community",
		links: [
			{ label: "Join Discord", link: "#" },
			{ label: "Follow on Twitter", link: "#" },
			{ label: "Email newsletter", link: "#" },
			{ label: "GitHub discussions", link: "#" },
		],
	},
];

const Landing = () => {
	// 2. Screenshots -
	// 3. Core Features - tab based rendered components
	// 4. Other Features - grid of icons with details

	const { classes } = useStyles();
	const [input, setInput] = React.useState("");
	const [opened, { toggle, close }] = useDisclosure(false);

	const placeholder =
		"It can’t help but hear a pin drop from over half a mile away, so it lives deep in the mountains where there aren’t many people or Pokémon.";

	const items = links.map((link) => (
		<a
			key={link.label}
			href={link.link}
			className={classes.link}
			onClick={(event) => {
				event.preventDefault();
				close();
			}}
		>
			{link.label}
		</a>
	));

	const groups = data.map((group) => {
		const links = group.links.map((link, index) => (
			<a href={link.link} style={{ textDecoration: "none" }}>
				<Text key={index} className={classes.linkFooter}>
					{link.label}
				</Text>
			</a>
		));

		return (
			<div className={classes.wrapperFooter} key={group.title}>
				<Text className={classes.titleFooter}>{group.title}</Text>
				{links}
			</div>
		);
	});

	return (
		<MantineProvider withGlobalStyles withNormalizeCSS>
			{/* Header */}
			<Header height={HEADER_HEIGHT} mb={30} className={classes.root}>
				<Container className={classes.header}>
					<Title
						size={"lg"}
						style={{
							fontWeight: 700,
							fontFamily: "Montserrat",
							fontSize: "2rem",
							color: "#6559fe",
						}}
					>
						Wellnation
					</Title>
					<Group spacing={5} className={classes.links}>
						{items}
					</Group>

					<Burger
						opened={opened}
						onClick={toggle}
						className={classes.burger}
						size="sm"
					/>

					<Transition
						transition="pop-top-right"
						duration={200}
						mounted={opened}
					>
						{(styles) => (
							<Paper className={classes.dropdown} withBorder style={styles}>
								{items}
							</Paper>
						)}
					</Transition>
				</Container>
			</Header>
			{/* Header */}
			{/* Hero Section */}
			<section id="about">
				<Container>
					<div className={classes.inner}>
						<div className={classes.content}>
							<Title className={classes.title}>
								A <span className={classes.highlight}>centralized</span>{" "}
								Healthcare System
							</Title>
							<Text color="dimmed" mt="md">
								Build fully functional accessible web applications faster than
								ever - Mantine includes more than 120 customizable components
								and hooks to cover you in any situation
							</Text>

							<List
								mt={30}
								spacing="sm"
								size="sm"
								icon={<CheckCircle sx={{ color: "#6559fe" }} />}
							>
								<List.Item>
									<b>TypeScript based</b> - build type safe applications, all
									components and hooks export types
								</List.Item>
								<List.Item>
									<b>Free and open source</b> - all packages have MIT license,
									you can use Mantine in any project
								</List.Item>
								<List.Item>
									<b>No annoying focus ring</b> - focus ring will appear only
									when user navigates with keyboard
								</List.Item>
							</List>

							<Group mt={30}>
								<Button
									radius="xl"
									size="md"
									className={classes.control}
									sx={{ backgroundColor: "#6559fe" }}
								>
									See the features
								</Button>
								<Button
									variant="default"
									radius="xl"
									size="md"
									className={classes.control}
								>
									Contact Us
								</Button>
							</Group>
						</div>
						<Image src="/hero.svg" className={classes.image} />
					</div>
				</Container>
			</section>
			{/* Hero Section */}
			{/* FAQ */}
			<section id="faq">
				<div className={classes.wrapper}>
					<Container size="lg">
						<Grid id="faq-grid" gutter={50}>
							<Col span={12} md={6}>
								<Image
									src="https://raw.githubusercontent.com/mantinedev/ui.mantine.dev/1e1c521d24127b7f6408c9506d98e1724f6df9d6/components/FaqWithImage/image.svg"
									alt="Frequently Asked Questions"
								/>
							</Col>
							<Col span={12} md={6}>
								<Title order={2} ta="left" className={classes.title}>
									Frequently Asked Questions
								</Title>

								<Accordion
									chevronPosition="right"
									defaultValue="reset-password"
									variant="separated"
								>
									<Accordion.Item
										className={classes.item}
										value="reset-password"
									>
										<Accordion.Control>
											How can I reset my password?
										</Accordion.Control>
										<Accordion.Panel>{placeholder}</Accordion.Panel>
									</Accordion.Item>

									<Accordion.Item
										className={classes.item}
										value="another-account"
									>
										<Accordion.Control>
											Can I create more that one account?
										</Accordion.Control>
										<Accordion.Panel>{placeholder}</Accordion.Panel>
									</Accordion.Item>

									<Accordion.Item className={classes.item} value="newsletter">
										<Accordion.Control>
											How can I subscribe to monthly newsletter?
										</Accordion.Control>
										<Accordion.Panel>{placeholder}</Accordion.Panel>
									</Accordion.Item>

									<Accordion.Item className={classes.item} value="credit-card">
										<Accordion.Control>
											Do you store credit card information securely?
										</Accordion.Control>
										<Accordion.Panel>{placeholder}</Accordion.Panel>
									</Accordion.Item>

									<Accordion.Item className={classes.item} value="payment">
										<Accordion.Control>
											What payment systems to you work with?
										</Accordion.Control>
										<Accordion.Panel>{placeholder}</Accordion.Panel>
									</Accordion.Item>
								</Accordion>
							</Col>
						</Grid>
					</Container>
				</div>
			</section>
			{/* FAQ */}
			{/* Footer */}
			<footer className={classes.footer}>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						marginBottom: "2rem",
						padding: "30px",
						backgroundColor: "#12229d",
					}}
				>
					<Title
						size={"lg"}
						style={{
							fontWeight: 700,
							fontFamily: "Montserrat",
							fontSize: "2rem",
							color: "white",
							textAlign: "center",
							marginBottom: "2rem",
						}}
					>
						Want to Reach Out? Contact Us Here
					</Title>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
							margin: "1rem auto",
						}}
					>
						<form
							style={{
								display: "flex",
							}}
							action={`mailto:wellnationhelp@gmail.com?subject=Contact%20Us&body=${input}`}
							method="POST"
						>
							<TextInput
								placeholder="Your input"
								variant="unstyled"
								radius="md"
								size="md"
								value={input}
								onChange={(event) => setInput(event.currentTarget.value)}
								style={{
									backgroundColor: "white",
									color: "black",
									borderStyle: "hidden",
									borderRadius: "1rem",
									padding: "0 1rem",
								}}
							/>
							<Button
								variant="default"
								radius="xl"
								size="md"
								style={{
									backgroundColor: "black",
									color: "white",
									marginLeft: "1rem",
									borderStyle: "hidden",
								}}
								type="submit"
							>
								Contact Us
							</Button>
						</form>
					</div>
				</div>
				<Container className={classes.innerFooter}>
					<div className={classes.logoFooter}>
						<Title
							size={"lg"}
							style={{
								fontWeight: 700,
								fontFamily: "Montserrat",
								fontSize: "2rem",
								color: "black",
							}}
						>
							Wellnation
						</Title>
						<Text size="xs" color="white" className={classes.description}>
							Build fully functional accessible web applications faster than
							ever
						</Text>
					</div>
					<div className={classes.groupsFooter}>{groups}</div>
				</Container>
				<Container className={classes.afterFooter}>
					<Text color="black" size="sm">
						© {new Date().getUTCFullYear} Wellnation. All rights reserved.
					</Text>

					<Group spacing={0} className={classes.social} position="right" noWrap>
						<ActionIcon size="lg" className={classes.socialIcon}>
							<Twitter fontSize="1.2rem" color="inherit" />
						</ActionIcon>
						<ActionIcon size="lg" className={classes.socialIcon}>
							<YouTube fontSize="1.2rem" color="inherit" />
						</ActionIcon>
						<ActionIcon size="lg" className={classes.socialIcon}>
							<Instagram fontSize="1.2rem" color="inherit" />
						</ActionIcon>
						<ActionIcon size="lg" className={classes.socialIcon}>
							<GitHub fontSize="1.2rem" color="inherit" />
						</ActionIcon>
					</Group>
				</Container>
			</footer>
			{/* Footer */}
		</MantineProvider>
	);
};

export default Landing;
