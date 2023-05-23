import React from "react"
import {
  MantineProvider,
  createStyles,
  Badge,
  Group,
  Title,
  Text,
  Card,
  SimpleGrid,
  Container,
  rem,
  Button,
  TextInput,
  Image,
  ThemeIcon,
} from "@mantine/core"
import useStyles from "@/components/landing.styles"
import { Beenhere, LocalHospital, EmergencyShare } from "@mui/icons-material"
import image from "@/public/icon.svg"
import { Carousel } from "@mantine/carousel"

const Landing = () => {
  // landing page using MUI having sections for:
  // 1. About - placeholder and hero section
  // 2. Screenshots -
  // 3. Core Features - tab based rendered components
  // 4. Other Features - grid of icons with details
  // 5. Pricing - FAQ
  // 6. Contact Us - form
  // 7. Footer - links to social media

  const { classes, theme } = useStyles()
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
      <h4>Header</h4>
      <h1>Hero section</h1>
      {/* Core features */}
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
      
    </MantineProvider>
  )
}

export default Landing

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
