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
	Card,
	SimpleGrid,
	ThemeIcon,
	Badge,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useStyles } from "@/components/landing.styles";
import {
	CheckCircle,
	Twitter,
	Instagram,
	YouTube,
	GitHub,
	Beenhere,
	LocalHospital,
	EmergencyShare,
} from "@mui/icons-material";
import image from "@/public/icon.svg";
import { Carousel } from "@mantine/carousel";

const HEADER_HEIGHT = rem(60);
const links = [
	{ label: "About", link: "#about" },
	{ label: "Screenshots", link: "#screenshots" },
	{ label: "Features", link: "#features" },
	{ label: "FAQ", link: "#faq" },
	{ label: "Contact Us", link: "#contact" },
];

const data = [
	{
		title: "About",
		links: [
			{ label: "Features", link: "#features" },
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
				// event.preventDefault()
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

	const slides = images.map((image) => (
		<Carousel.Slide key={image}>
			<Image src={image} height={220} />
		</Carousel.Slide>
	));
	const features = coreFeatures.map((feature) => (
		<Card radius="md" withBorder padding="xl">
			<Card.Section>
				<Carousel
					withIndicators
					loop
					classNames={{
						root: classes.cfeatcarousel,
						controls: classes.cfeatcarouselControls,
						indicator: classes.cfeatcarouselIndicator,
					}}
				>
					{slides}
				</Carousel>
			</Card.Section>

			<Group position="apart" mt="lg">
				<Text fw={500} fz="lg">
					{feature.title}
				</Text>
			</Group>

			<Text fz="sm" c="dimmed" mt="sm">
				{feature.description}
			</Text>

			<Group position="apart" mt="md">
				{/* <div>
          <Text fz="xl" span fw={500} className={classes.cfeatprice}>
            397$
          </Text>
          <Text span fz="sm" c="dimmed">
            {" "}
            / night
          </Text>
        </div> */}
				<a href={"#" + feature.name}>
					<Button radius="md">Know the flow</Button>
				</a>
			</Group>
		</Card>
	));

	function Feature({ icon: Icon, title, description }) {
		return (
			<div>
				<ThemeIcon variant="light" size={40} radius={40}>
					<Icon size="1.1rem" stroke={1.5} />
				</ThemeIcon>
				<Text mt="sm" mb={7}>
					{title}
				</Text>
				<Text size="sm" color="dimmed" sx={{ lineHeight: 1.6 }}>
					{description}
				</Text>
			</div>
		);
	}

	const otherfeatures = otherFeatures.map((feature, index) => (
		<Feature {...feature} key={index} />
	));

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
								<span className={classes.ofeathighlight}>Healthier</span> you,
								happier <span className={classes.highlight}>world</span>.
							</Title>
							<Text color="dimmed" mt="md">
								Revolutionizing healthcare with real-time data and transparent
								information. Discover nearby hospitals, book appointments, and
								access vital medical services through our intuitive apps and web
								portal. Experience the future of immediate healthcare support
								with WellBot and our emergency SOS Alert system. Join us today
								and transform your healthcare journey.
							</Text>

							<List
								mt={30}
								spacing="sm"
								size="sm"
								icon={<CheckCircle sx={{ color: "#6559fe" }} />}
							>
								<List.Item>
									<b>Public User App</b> - Find nearby hospitals, book
									appointments, access real-time information on doctors and
									tests.
								</List.Item>
								<List.Item>
									<b>Web Portal for Hospitals</b> - Streamline appointment
									scheduling, manage patient data, and collaborate with doctors
									and service providers.
								</List.Item>
								<List.Item>
									<b>Web Portal for Doctors</b> - Access patient records, review
									appointments, and communicate with hospitals and colleagues
									for personalized care.
								</List.Item>
								<List.Item>
									<b>Ambulance Driver App</b> - Enhance communication and
									coordination for efficient patient transportation and
									emergency response.
								</List.Item>
							</List>

							<Group mt={30}>
								<a href="#features">
									<Button
										radius="xl"
										size="md"
										className={classes.control}
										sx={{ backgroundColor: "#6559fe" }}
									>
										See the features
									</Button>
								</a>
								<a href="#contact">
									<Button
										variant="default"
										radius="xl"
										size="md"
										className={classes.control}
									>
										Contact Us
									</Button>
								</a>
							</Group>
						</div>
						<Image src="/hero.svg" className={classes.image} />
					</div>
				</Container>
			</section>
			{/* Hero Section */}
			{/* Core features */}
			<section id="features">
				<Container size="lg" py="xl">
					<Group position="center">
						<Badge variant="filled" size="lg">
							Core Features Wellnation provides
						</Badge>
					</Group>

					<Title order={2} className={classes.featTitle} ta="center" mt="sm">
						Transforming Healthcare, Real-time Solutions.
					</Title>

					<Text
						c="dimmed"
						className={classes.featDescription}
						ta="center"
						mt="md"
					>
						Empowering Healthcare: Seamless Booking, Real-time Data, Rapid
						Response
					</Text>

					<SimpleGrid
						cols={3}
						spacing="xl"
						mt={50}
						breakpoints={[{ maxWidth: "md", cols: 1 }]}
					>
						{features}
					</SimpleGrid>
				</Container>
				{/* Other features */}
				<Container className={classes.ofeatwrapper}>
					<Title className={classes.ofeattitle}>
						Enriching Healthcare system{" "}
						<span className={classes.ofeathighlight}>for All</span>.
					</Title>

					<Container size={560} p={0}>
						<Text size="sm" className={classes.ofeatdescription}>
							Bridging the Gap: WellNation revolutionizes healthcare for all
							stakeholders, connecting users, hospitals, doctors, and service
							providers through seamless technology.
						</Text>
					</Container>

					<SimpleGrid
						mt={60}
						cols={3}
						spacing={50}
						breakpoints={[
							{ maxWidth: 980, cols: 2, spacing: "xl" },
							{ maxWidth: 755, cols: 1, spacing: "xl" },
						]}
					>
						{otherfeatures}
					</SimpleGrid>
				</Container>
				{/* Appointment feat */}
				<div className={classes.banwrapper} id="appointment">
					<div className={classes.banbody}>
						<Title className={classes.bantitle}>Wait a minute...</Title>
						<Text fw={500} fz="lg" mb={5}>
							Subscribe to our newsletter!
						</Text>
						<Text fz="sm" c="dimmed">
							You will never miss important product updates, latest news and
							community QA sessions. Our newsletter is once a week, every
							Sunday.
						</Text>

						<div className={classes.bancontrols}>
							<TextInput
								placeholder="Your email"
								classNames={{
									input: classes.baninput,
									root: classes.baninputWrapper,
								}}
							/>
							<Button className={classes.bancontrol}>Subscribe</Button>
						</div>
					</div>
					<Image src={image.src} className={classes.banimage} />
				</div>

				{/* emergency feat */}
				<div className={classes.banwrapper}>
					<Image src={image.src} className={classes.banimage} />
					<div className={classes.banbody}>
						<Title className={classes.bantitle}>Wait a minute...</Title>
						<Text fw={500} fz="lg" mb={5}>
							Subscribe to our newsletter!
						</Text>
						<Text fz="sm" c="dimmed">
							You will never miss important product updates, latest news and
							community QA sessions. Our newsletter is once a week, every
							Sunday.
						</Text>

						<div className={classes.bancontrols}>
							<TextInput
								placeholder="Your email"
								classNames={{
									input: classes.baninput,
									root: classes.baninputWrapper,
								}}
							/>
							<Button className={classes.bancontrol}>Subscribe</Button>
						</div>
					</div>
				</div>

				{/* Ambulancefeat */}
				<div className={classes.banwrapper} id="ambulance">
					<div className={classes.banbody}>
						<Title className={classes.bantitle}>Wait a minute...</Title>
						<Text fw={500} fz="lg" mb={5}>
							Subscribe to our newsletter!
						</Text>
						<Text fz="sm" c="dimmed">
							You will never miss important product updates, latest news and
							community QA sessions. Our newsletter is once a week, every
							Sunday.
						</Text>

						<div className={classes.bancontrols}>
							<TextInput
								placeholder="Your email"
								classNames={{
									input: classes.baninput,
									root: classes.baninputWrapper,
								}}
							/>
							<Button className={classes.bancontrol}>Subscribe</Button>
						</div>
					</div>
					<Image src={image.src} className={classes.banimage} />
				</div>
			</section>
			{/* Features */}
			{/* FAQ */}
			<section id="faq">
				<div className={classes.wrapper}>
					<Container size="lg">
						<Grid id="faq-grid" gutter={50}>
							<Col span={12} md={6}>
								<Image
									src="https://raw.githubusercontent.com/Wellnation/wellnation-web-portal/main/web-portal/public/FAQs.svg"
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
			<section id="login">
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "#12229d",
						borderStyle: "none",
						padding: "30px",
						marginTop: "50px",
					}}
				>
					{localStorage.getItem("hId") ? (
						<>
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
								onClick={() => (window.location.href = "/home")}
							>
								Go to Hospital Portal
							</Button>
						</>
					) : localStorage.getItem("dId") ? (
						<>
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
								onClick={() => (window.location.href = `/doctors/${localStorage.getItem("dId")}`)}
							>
								Go to Doctor Portal
							</Button>
						</>
					) : (
						<>
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
								onClick={() => (window.location.href = "/login")}
							>
								Login to Hospital Portal
							</Button>
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
								onClick={() => (window.location.href = "/doctors/login")}
							>
								Login to Doctor Portal
							</Button>
						</>
					)}
				</div>
			</section>
			{/* Footer */}
			<footer
				className={classes.footer}
				id="contact"
				style={{ borderStyle: "none" }}
			>
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
							Healthier you, happier world.
						</Text>
					</div>
					<div className={classes.groupsFooter}>{groups}</div>
				</Container>
				<Container className={classes.afterFooter}>
					<Text color="black" size="sm">
						© {new Date().getFullYear} Wellnation. All rights reserved.
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

const otherFeatures = [
	{
		icon: Beenhere,
		title: "Health Passport",
		description:
			"Although it still can’t fly, its jumping power is outstanding, in Alola the mushrooms on Paras don’t grow up quite right",
	},
	{
		icon: Beenhere,
		title: "Bookings and Real-time Updates",
		description:
			"This dust is actually a powerful poison that will even make a pro wrestler sick, Regice cloaks itself with frigid air of -328 degrees Fahrenheit",
	},
	{
		icon: Beenhere,
		title: "Vital tracking and monitoring",
		description:
			"People say it can run at the same speed as lightning striking, Its icy body is so cold, it will not melt even if it is immersed in magma",
	},
	{
		icon: Beenhere,
		title: "Family access and support",
		description:
			"They’re popular, but they’re rare. Trainers who show them off recklessly may be targeted by thieves",
	},
	{
		icon: Beenhere,
		title: "Volunteer for help",
		description:
			"Rapidash usually can be seen casually cantering in the fields and plains, Skitty is known to chase around after its own tail",
	},
	{
		icon: Beenhere,
		title: "WellBot",
		description:
			"Rapidash usually can be seen casually cantering in the fields and plains, Skitty is known to chase around after its own tail",
	},
];

const images = [
	"https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
	"https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
	"https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
	"https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
	"https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
];

const coreFeatures = [
	{
		name: "appointment",
		title: "Book Appointments effortlessly",
		description:
			"Experience the convenience of online and offline appointments, streamlining your healthcare journey, where symptoms can be described through voice or text and automatically classified into the right department using our advanced ML model. ",
		icon: Beenhere,
	},
	{
		name: "emergency",
		title: "Send Emergency Signals",
		description:
			"Instant Emergency Response: One click sends distress signals to nearby hospitals and family members, providing real-time updates and push notifications for immediate assistance. WellNation: Your lifeline in critical situations",
		icon: LocalHospital,
	},
	{
		name: "ambulance",
		title: "Ambulance booking and tracking",
		description:
			"Rapid Ambulance Assistance: Book and track ambulances instantly for yourself or family members. Real-time updates ensure efficient pickup and drop-off, empowering users and hospitals with WellNation's seamless emergency response.",
		icon: EmergencyShare,
	},
];

export default Landing;
