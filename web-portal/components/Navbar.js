import React from "react";
import {
	AppBar,
	Avatar,
	Box,
	Button,
	Container,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItemButton,
	ListItemText,
	Menu,
	MenuItem,
	Toolbar,
	Tooltip,
	Typography,
	Badge,
} from "@mui/material";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth, useAdminMode } from "@/lib/zustand.config";
import { useRouter } from "next/router";
import { logout } from "@/pages/api/auth.hospital";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { useQuery } from "react-query";
import { Loader } from "./utils";

const drawerWidth = 240;

function Navbar() {
	const router = useRouter();
	const { user, loading } = useAuth();
	const dId = localStorage.getItem("dId");
	const [doctor, setDoctor] = React.useState(false);
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const [anchorElUser, setAnchorElUser] = React.useState(null);
	const { adminMode } = useAdminMode();

	const {
		data: badge,
		isLoading,
		error,
	} = useQuery("badge", async () => {
		const colSnap = collection(db, "emergency");
		const snap = await getDocs(colSnap);
		return snap.docs.length;
	});

	React.useEffect(() => {
		if (router.pathname.includes("doctors")) setDoctor(true);
	}, [router.pathname]);

	const navItems = [
		{
			name: "Home",
			link: "/home",
		},
		{
			name: "Tests",
			link: "/tests",
		},
		{
			name: "Admins",
			link: "/admins",
		},
		{
			name: "About",
			link: "/about",
		},
		{
			name: (
				<Badge color="error" badgeContent={Number(badge)}>
					Emergency
				</Badge>
			),
			link: "/emergency",
		},
	];

	const settings = [
		{
			name: "Account",
			click: () => {
				router.push("/account");
			},
		},
		{
			name: "Dashboard",
			click: () => {
				router.push("/dashboard");
			},
		},
		{
			name: "Logout",
			click: () => {
				logout();
				localStorage.removeItem("hId");
				localStorage.removeItem("dId");
				router.push("/");
			},
		},
	];

	const navForDoctors = [
		{
			name: "Home",
			link: `/doctors/${dId}`,
		},
		// {
		// 	name: (
		// 		<Badge color="error" badgeContent={Number(badge)}>
		// 			Emergency
		// 		</Badge>
		// 	),
		// 	link: "/emergency",
		// },
	];

	const setForDoctor = [
		{
			name: "Account",
			click: () => {
				router.push(`/doctors/${dId}/account`);
			},
		},
		{
			name: "Logout",
			click: () => {
				localStorage.removeItem("hId");
				localStorage.removeItem("dId");
				logout();
				router.push("/");
			},
		},
	];

	const adminSettings = [
		{
			name: "Account",
			click: () => {
				window.location.href = window.location.origin + "/account";
			},
		},
		{
			name: "Logout",
			click: () => {
				localStorage.removeItem("hId");
				localStorage.removeItem("aId");
				localStorage.removeItem("scopes");
				window.location.href = window.location.origin + "/";
			},
		},
	];

	const handleDrawerToggle = () => {
		setMobileOpen((prevState) => !prevState);
	};

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const container = undefined;

	const drawer = (
		<Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
			<Typography
				variant="h6"
				sx={{ my: 2 }}
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Image
					src="/icon-light-2.svg"
					width={40}
					height={40}
					alt="Hospital Logo"
					style={{
						paddingRight: "10px",
					}}
				/>
				WELLNATION
			</Typography>
			<Divider />
			{!adminMode ? (
				user && (
					<List>
						{(doctor ? navForDoctors : navItems).map((item) => (
							<MenuItem
								key={item.name}
								onClick={() => router.push(`/${item.link}`)}
							>
								<ListItemButton sx={{ textAlign: "center" }}>
									<ListItemText primary={item.name} />
								</ListItemButton>
							</MenuItem>
						))}
					</List>
				)
			) : localStorage.getItem("scopes").split(",").length > 1 ? (
				<List>
					<MenuItem
						onClick={() => (window.location.href = window.location.origin)}
					>
						<ListItemButton sx={{ textAlign: "center" }}>
							<ListItemText primary="Home" />
						</ListItemButton>
					</MenuItem>
					<MenuItem
						onClick={() =>
							(window.location.href = window.location.origin + "/tests")
						}
					>
						<ListItemButton sx={{ textAlign: "center" }}>
							<ListItemText primary="Tests" />
						</ListItemButton>
					</MenuItem>
				</List>
			) : null}
		</Box>
	);

	if (isLoading) return <Loader />;

	return (
		<>
			<AppBar position="sticky">
				<Container maxWidth="xl">
					<Toolbar disableGutters>
						<Image
							className="logo-large"
							src="/icon-light-2.svg"
							width={40}
							height={40}
							alt="Hospital Logo"
							style={{
								cursor: "pointer",
								paddingRight: "10px",
							}}
						/>
						<Typography
							variant="h6"
							noWrap
							component="a"
							href="/"
							sx={{
								mr: 2,
								display: { xs: "none", md: "flex" },
								fontWeight: 700,
								color: "inherit",
								textDecoration: "none",
							}}
						>
							WELLNATION
						</Typography>

						<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
							<IconButton
								size="large"
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={handleDrawerToggle}
								color="inherit"
							>
								<MenuIcon />
							</IconButton>
						</Box>
						<Image
							className="logo-small"
							src="/icon-light-2.svg"
							width={40}
							height={40}
							alt="Hospital Logo"
							style={{
								cursor: "pointer",
								paddingRight: "10px",
							}}
						/>
						<Typography
							variant="h5"
							noWrap
							component="a"
							href=""
							sx={{
								mr: 2,
								display: { xs: "flex", md: "none" },
								flexGrow: 1,
								fontWeight: 700,
								color: "inherit",
								textDecoration: "none",
							}}
						>
							WELLNATION
						</Typography>
						<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
							{!adminMode ? (
								user &&
								(doctor ? navForDoctors : navItems).map((page) => (
									<Button
										key={page.name}
										onClick={() => router.push(`/${page.link}`)}
										sx={{ my: 2, color: "white", display: "block" }}
									>
										{page.name}
									</Button>
								))
							) : localStorage.getItem("scopes").split(",").length > 1 ? (
								<>
									<Button
										onClick={() =>
											(window.location.href = window.location.origin)
										}
										sx={{ my: 2, color: "white", display: "block" }}
									>
										Home
									</Button>
									<Button
										onClick={() =>
											(window.location.href = window.location.origin + "/tests")
										}
										sx={{ my: 2, color: "white", display: "block" }}
									>
										Tests
									</Button>
								</>
							) : null}
						</Box>

						<Box sx={{ flexGrow: 0 }}>
							{!adminMode ? (
								user ? (
									<>
										<Tooltip title="Open settings">
											<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
												<Avatar
													alt="Remy Sharp"
													src="https://www.w3schools.com/howto/img_avatar.png"
												/>
											</IconButton>
										</Tooltip>
										<Menu
											sx={{ mt: "45px" }}
											id="menu-appbar"
											anchorEl={anchorElUser}
											anchorOrigin={{
												vertical: "top",
												horizontal: "right",
											}}
											keepMounted
											transformOrigin={{
												vertical: "top",
												horizontal: "right",
											}}
											open={Boolean(anchorElUser)}
											onClose={handleCloseUserMenu}
										>
											{(doctor ? setForDoctor : settings).map((item) => (
												<MenuItem
													key={item.name}
													onClick={() => {
														item.click();
														handleCloseUserMenu();
													}}
												>
													<Typography textAlign="center">
														{item.name}
													</Typography>
												</MenuItem>
											))}
										</Menu>
									</>
								) : (
									<Button variant="text" href="/login">
										<div style={{ color: "white" }}>Login</div>
									</Button>
								)
							) : localStorage.getItem("aId") ? (
								<>
									<Tooltip title="Open settings">
										<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
											<Avatar
												alt="Remy Sharp"
												src="https://www.w3schools.com/howto/img_avatar.png"
											/>
										</IconButton>
									</Tooltip>
									<Menu
										sx={{ mt: "45px" }}
										id="menu-appbar"
										anchorEl={anchorElUser}
										anchorOrigin={{
											vertical: "top",
											horizontal: "right",
										}}
										keepMounted
										transformOrigin={{
											vertical: "top",
											horizontal: "right",
										}}
										open={Boolean(anchorElUser)}
										onClose={handleCloseUserMenu}
									>
										{adminSettings.map((item) => (
											<MenuItem
												key={item.name}
												onClick={() => {
													item.click();
													handleCloseUserMenu();
												}}
											>
												<Typography textAlign="center">{item.name}</Typography>
											</MenuItem>
										))}
									</Menu>
								</>
							) : (
								<Button
									variant="text"
									onClick={
										(window.location.href = window.location.origin + "/login")
									}
								>
									<div style={{ color: "white" }}>Login</div>
								</Button>
							)}
						</Box>
					</Toolbar>
				</Container>
			</AppBar>
			<Box component="nav">
				<Drawer
					container={container}
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true,
					}}
					sx={{
						display: { xs: "block", sm: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
				>
					{drawer}
				</Drawer>
			</Box>
		</>
	);
}
export default Navbar;
