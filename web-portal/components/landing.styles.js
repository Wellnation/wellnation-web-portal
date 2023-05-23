import { createStyles, rem, getStylesRef } from "@mantine/core";

const HEADER_HEIGHT = rem(60);

export const useStyles = createStyles((theme) => ({
	root: {
		position: "relative",
		zIndex: 1,
	},

	dropdown: {
		position: "absolute",
		top: HEADER_HEIGHT,
		left: 0,
		right: 0,
		zIndex: 0,
		borderTopRightRadius: 0,
		borderTopLeftRadius: 0,
		borderTopWidth: 0,
		overflow: "hidden",

		[theme.fn.largerThan("sm")]: {
			display: "none",
		},
	},

	header: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		height: "100%",
	},

	links: {
		[theme.fn.smallerThan("sm")]: {
			display: "none",
		},
	},

	burger: {
		[theme.fn.largerThan("sm")]: {
			display: "none",
		},
	},

	link: {
		display: "block",
		lineHeight: 1,
		padding: `${rem(8)} ${rem(12)}`,
		borderRadius: theme.radius.sm,
		textDecoration: "none",
		color:
			theme.colorScheme === "dark"
				? theme.colors.dark[0]
				: theme.colors.gray[7],
		fontSize: theme.fontSizes.sm,
		fontWeight: 500,

		"&:hover": {
			backgroundColor:
				theme.colorScheme === "dark"
					? theme.colors.dark[6]
					: theme.colors.gray[0],
			color: "#6559fe",
		},

		[theme.fn.smallerThan("sm")]: {
			borderRadius: 0,
			padding: theme.spacing.md,
		},
	},

	linkActive: {
		"&, &:hover": {
			backgroundColor: theme.fn.variant({
				variant: "light",
				color: theme.primaryColor,
			}).background,
			color: "#6559fe",
		},
	},

	inner: {
		display: "flex",
		justifyContent: "space-between",
		paddingTop: `calc(${theme.spacing.xl} * 2)`,
		paddingBottom: `calc(${theme.spacing.xl} * 4)`,
	},

	content: {
		maxWidth: rem(480),
		marginRight: `calc(${theme.spacing.xl} * 3)`,

		[theme.fn.smallerThan("md")]: {
			maxWidth: "100%",
			marginRight: 0,
		},
	},

	title: {
		color: theme.colorScheme === "dark" ? theme.white : theme.black,
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		fontSize: rem(44),
		lineHeight: 1.2,
		fontWeight: 900,

		[theme.fn.smallerThan("xs")]: {
			fontSize: rem(28),
		},
	},

	control: {
		[theme.fn.smallerThan("xs")]: {
			flex: 1,
		},
	},

	image: {
		flex: 1,

		[theme.fn.smallerThan("md")]: {
			display: "none",
		},
	},

	highlight: {
		position: "relative",
		backgroundColor: theme.fn.variant({
			variant: "light",
			color: theme.primaryColor,
		}).background,
		borderRadius: theme.radius.sm,
		padding: `${rem(2)} ${rem(2)}`,
	},

	footer: {
		marginTop: rem(120),
		paddingBottom: `calc(${theme.spacing.xl} * 2)`,
		backgroundColor: "#6559fe",
		borderTop: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
			}`,
	},

	logoFooter: {
		maxWidth: rem(200),

		[theme.fn.smallerThan("sm")]: {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
		},
	},

	description: {
		marginTop: rem(5),
		fontWeight: 700,

		[theme.fn.smallerThan("sm")]: {
			marginTop: theme.spacing.xs,
			textAlign: "center",
		},
	},

	innerFooter: {
		display: "flex",
		justifyContent: "space-between",

		[theme.fn.smallerThan("sm")]: {
			flexDirection: "column",
			alignItems: "center",
		},
	},

	groupsFooter: {
		display: "flex",
		flexWrap: "wrap",

		[theme.fn.smallerThan("sm")]: {
			display: "none",
		},
	},

	wrapperFooter: {
		width: rem(160),
	},

	linkFooter: {
		display: "block",
		color: "white",
		fontSize: theme.fontSizes.sm,
		paddingTop: rem(3),
		paddingBottom: rem(3),

		"&:hover": {
			textDecoration: "underline",
		},
	},

	titleFooter: {
		fontSize: theme.fontSizes.lg,
		fontWeight: 700,
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		marginBottom: `calc(${theme.spacing.xs} / 2)`,
		color: "black",
	},

	afterFooter: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: theme.spacing.xl,
		paddingTop: theme.spacing.xl,
		paddingBottom: theme.spacing.xl,
		borderTop: `${rem(1)} solid black`,

		[theme.fn.smallerThan("sm")]: {
			flexDirection: "column",
		},
	},

	social: {
		[theme.fn.smallerThan("sm")]: {
			marginTop: theme.spacing.xs,
		},
	},

	socialIcon: {
		color: "white",
		"&:hover": {
			color: "#6559fe",
		},
	},

	wrapperFAQ: {
		paddingTop: `calc(${theme.spacing.xl} * 2)`,
		paddingBottom: `calc(${theme.spacing.xl} * 2)`,
	},

	titleFAQ: {
		marginBottom: theme.spacing.md,
		paddingLeft: theme.spacing.md,
		color: theme.colorScheme === "dark" ? theme.white : theme.black,
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
	},

	itemFAQ: {
		fontSize: theme.fontSizes.sm,
		color:
			theme.colorScheme === "dark"
				? theme.colors.dark[1]
				: theme.colors.gray[7],
	},

	featTitle: {
		fontSize: rem(34),
		fontWeight: 900,

		[theme.fn.smallerThan("sm")]: {
			fontSize: rem(24),
		},
	},

	featDescription: {
		maxWidth: 800,
		margin: "auto",

		"&::after": {
			content: '""',
			display: "block",
			backgroundColor: theme.fn.primaryColor(),
			width: rem(55),
			height: rem(2),
			marginTop: theme.spacing.sm,
			marginLeft: "auto",
			marginRight: "auto",
		},
	},

	featCard: {
		border: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]}`,
	},

	featCardTitle: {
		"&::after": {
			content: '""',
			display: "block",
			backgroundColor: theme.fn.primaryColor(),
			width: rem(45),
			height: rem(2),
			marginTop: theme.spacing.sm,
		},
	},

	cfeatprice: {
		color: theme.colorScheme === "dark" ? theme.white : theme.black,
	},

	cfeatcarousel: {
		"&:hover": {
			[`& .${getStylesRef("carouselControls")}`]: {
				opacity: 1,
			},
		},
	},

	cfeatcarouselControls: {
		ref: getStylesRef("carouselControls"),
		transition: "opacity 150ms ease",
		opacity: 0,
	},

	cfeatcarouselIndicator: {
		width: rem(4),
		height: rem(4),
		transition: "width 250ms ease",

		"&[data-active]": {
			width: rem(16),
		},
	},

	banwrapper: {
		display: 'flex',
		alignItems: 'center',
    padding: `calc(${theme.spacing.xl} * 2)`,
    marginTop: `calc(${theme.spacing.xl} * 4)`,
		marginBottom: `calc(${theme.spacing.xl} * 4)`,
		borderRadius: theme.radius.md,
		marginLeft: `calc(${theme.spacing.xl} * 4)`,
		marginRight: `calc(${theme.spacing.xl} * 4)`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
		border: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[3]
			}`,

		[theme.fn.smallerThan('sm')]: {
			flexDirection: 'column-reverse',
			padding: theme.spacing.xl,
		},
	},

	banimage: {
		maxWidth: '40%',

		[theme.fn.smallerThan('sm')]: {
			maxWidth: '100%',
		},
	},

	banbody: {
		paddingRight: `calc(${theme.spacing.xl} * 2)`,

		[theme.fn.smallerThan('sm')]: {
			paddingRight: 0,
			marginTop: theme.spacing.xl,
		},
	},

	bantitle: {
		color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		lineHeight: 1,
		marginBottom: theme.spacing.md,
	},

	bancontrols: {
		display: 'flex',
		marginTop: theme.spacing.xl,
	},

	baninputWrapper: {
		width: '100%',
		flex: '1',
	},

	baninput: {
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0,
		borderRight: 0,
	},

	bancontrol: {
		borderTopLeftRadius: 0,
		borderBottomLeftRadius: 0,
	},

	ofeatwrapper: {
		paddingTop: `calc(${theme.spacing.xl} * 4)`,
		paddingBottom: `calc(${theme.spacing.xl} * 4)`,
	},

	ofeattitle: {
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		fontWeight: 900,
		marginBottom: theme.spacing.md,
		textAlign: 'center',

		[theme.fn.smallerThan('sm')]: {
			fontSize: rem(28),
			textAlign: 'left',
		},
	},

	ofeatdescription: {
		textAlign: 'center',

		[theme.fn.smallerThan('sm')]: {
			textAlign: 'left',
		},
	},

	ofeathighlight: {
		backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
		padding: rem(5),
		paddingTop: 0,
		borderRadius: theme.radius.sm,
		display: 'inline-block',
		color: theme.colorScheme === 'dark' ? theme.white : 'inherit',
	},
}));