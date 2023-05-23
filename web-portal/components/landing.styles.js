import { createStyles, rem } from "@mantine/core";

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
		paddingTop: `calc(${theme.spacing.xl} * 4)`,
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
		padding: `${rem(4)} ${rem(12)}`,
	},

	footer: {
		marginTop: rem(120),
		paddingBottom: `calc(${theme.spacing.xl} * 2)`,
		backgroundColor: "#6559fe",
		borderTop: `${rem(1)} solid ${
			theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
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
}));
