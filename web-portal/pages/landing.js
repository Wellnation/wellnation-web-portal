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
	EmergencyShare
} from "@mui/icons-material";
import image from "@/public/icon.svg"
import { Carousel } from "@mantine/carousel"

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

	const slides = images.map((image) => (
    <Carousel.Slide key={image}>
      <Image src={image} height={220} />
    </Carousel.Slide>
  ))
  const features = mockdata.map((feature) => (
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

        <Group spacing={5}>
          {/* <IconStar size="1rem" /> */}
          <Text fz="xs" fw={500}>
            4.78
          </Text>
        </Group>
      </Group>

      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>

      <Group position="apart" mt="md">
        <div>
          <Text fz="xl" span fw={500} className={classes.cfeatprice}>
            397$
          </Text>
          <Text span fz="sm" c="dimmed">
            {" "}
            / night
          </Text>
        </div>

        <Button radius="md">Book now</Button>
      </Group>
    </Card>
  ))

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
    )
  }

  const otherfeatures = MOCKDATA.map((feature, index) => <Feature {...feature} key={index} />)

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
			{/* Core features */}
			<section id="features">
				<Container size="lg" py="xl">
					<Group position="center">
						<Badge variant="filled" size="lg">
							Core Features Wellnation provides
						</Badge>
					</Group>

					<Title order={2} className={classes.featTitle} ta="center" mt="sm">
						Integrate effortlessly with any technology stack
					</Title>

					<Text c="dimmed" className={classes.featDescription} ta="center" mt="md">
						Every once in a while, you’ll see a Golbat that’s missing some fangs. This happens when hunger drives it to
						try biting a Steel-type Pokémon.
					</Text>

					<SimpleGrid cols={3} spacing="xl" mt={50} breakpoints={[{ maxWidth: "md", cols: 1 }]}>
						{features}
					</SimpleGrid>
				</Container>
				{/* Other features */}
				<Container className={classes.ofeatwrapper}>
					<Title className={classes.ofeattitle}>
						PharmLand is <span className={classes.ofeathighlight}>not</span> just for pharmacists
					</Title>

					<Container size={560} p={0}>
						<Text size="sm" className={classes.ofeatdescription}>
							Its lungs contain an organ that creates electricity. The crackling sound of electricity can be heard when it
							exhales. Azurill’s tail is large and bouncy. It is packed full of the nutrients this Pokémon needs to grow.
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
				<div className={classes.banwrapper}>
					<div className={classes.banbody}>
						<Title className={classes.bantitle}>Wait a minute...</Title>
						<Text fw={500} fz="lg" mb={5}>
							Subscribe to our newsletter!
						</Text>
						<Text fz="sm" c="dimmed">
							You will never miss important product updates, latest news and community QA sessions. Our
							newsletter is once a week, every Sunday.
						</Text>

						<div className={classes.bancontrols}>
							<TextInput
								placeholder="Your email"
								classNames={{ input: classes.baninput, root: classes.baninputWrapper }}
							/>
							<Button className={classes.bancontrol}>Subscribe</Button>
						</div>
					</div>
					<Image src={image.src} className={classes.banimage} />
				</div>
      
				{/* Appointment feat */}
				<div className={classes.banwrapper}>
					<Image src={image.src} className={classes.banimage} />
					<div className={classes.banbody}>
						<Title className={classes.bantitle}>Wait a minute...</Title>
						<Text fw={500} fz="lg" mb={5}>
							Subscribe to our newsletter!
						</Text>
						<Text fz="sm" c="dimmed">
							You will never miss important product updates, latest news and community QA sessions. Our
							newsletter is once a week, every Sunday.
						</Text>

						<div className={classes.bancontrols}>
							<TextInput
								placeholder="Your email"
								classNames={{ input: classes.baninput, root: classes.baninputWrapper }}
							/>
							<Button className={classes.bancontrol}>Subscribe</Button>
						</div>
					</div>
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

export const MOCKDATA = [
  {
    icon: Beenhere,
    title: "Extreme performance",
    description:
      "This dust is actually a powerful poison that will even make a pro wrestler sick, Regice cloaks itself with frigid air of -328 degrees Fahrenheit",
  },
  {
    icon: Beenhere,
    title: "Privacy focused",
    description:
      "People say it can run at the same speed as lightning striking, Its icy body is so cold, it will not melt even if it is immersed in magma",
  },
  {
    icon: Beenhere,
    title: "No third parties",
    description: "They’re popular, but they’re rare. Trainers who show them off recklessly may be targeted by thieves",
  },
  {
    icon: Beenhere,
    title: "Secure by default",
    description:
      "Although it still can’t fly, its jumping power is outstanding, in Alola the mushrooms on Paras don’t grow up quite right",
  },
  {
    icon: Beenhere,
    title: "24/7 Support",
    description:
      "Rapidash usually can be seen casually cantering in the fields and plains, Skitty is known to chase around after its own tail",
  },
]

const images = [
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
]

const mockdata = [
  {
    title: "Book Appointments effortlessly",
    description:
      "Experience the convenience of online and offline appointments, streamlining your healthcare journey, where symptoms can be described through voice or text and automatically classified into the right department using our advanced ML model. ",
    icon: Beenhere,
  },
  {
    title: "Send Emergency Signals",
    description:
      "People say it can run at the same speed as lightning striking, Its icy body is so cold, it will not melt even if it is immersed in magma",
    icon: LocalHospital,
  },
  {
    title: "Ambulance booking and tracking",
    description: "They’re popular, but they’re rare. Trainers who show them off recklessly may be targeted by thieves",
    icon: EmergencyShare,
  },
]

export default Landing;
