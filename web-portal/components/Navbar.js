import React from 'react';
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
} from '@mui/material';
import Image from 'next/image';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '@/lib/zustand.config';
import { useRouter } from 'next/router';
import { logout } from '@/pages/api/auth.hospital';

const drawerWidth = 240;
const navItems = [
	{
		name: 'Home',
		link: '/',
	},
	{
		name: 'History',
		link: '/history',
	},
	{
		name: 'About',
		link: '/about',
	},
	{
		name: 'Contact',
		link: '/contact',
	},
	{
		name: 'Emergency',
		link: '/emergency',
	}
];

function Navbar() {
	const [anchorElUser, setAnchorElUser] = React.useState(null);
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const { user, loading } = useAuth();
	const router = useRouter();

	const settings = [
		{
			name: 'Account',
			click: () => {
				router.push('/account');
			},
		},
		{
			name: 'Dashboard',
			click: () => {
				router.push('/dashboard');
			},
		},
		{
			name: 'Logout',
			click: () => {
				logout();
				router.push('/');
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
		<Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
			<Typography
				variant="h6"
				sx={{ my: 2 }}
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<Image
					src="/icon-light-2.svg"
					width={40}
					height={40}
					alt="Hospital Logo"
					style={{
						paddingRight: '10px'
					}}
				/>
				WELLNATION
			</Typography>
			<Divider />
			<List>
				{navItems.map((item) => (
					<MenuItem key={item.name} onClick={() => router.push(`/${item.link}`)}>
						<ListItemButton sx={{ textAlign: 'center' }}>
							<ListItemText primary={item.name} />
						</ListItemButton>
					</MenuItem>
				))}
			</List>
		</Box>
	);

	return (
		<>
			<AppBar position="sticky">
				<Container maxWidth="xl">
					<Toolbar disableGutters>
						<Image
							className='logo-large'
							src="/icon-light-2.svg"
							width={40}
							height={40}
							alt="Hospital Logo"
							style={{
								cursor: 'pointer',
								paddingRight: '10px',
							}}
						/>
						<Typography
							variant="h6"
							noWrap
							component="a"
							href="/"
							sx={{
								mr: 2,
								display: { xs: 'none', md: 'flex' },
								fontWeight: 700,
								color: 'inherit',
								textDecoration: 'none',
							}}
						>
							WELLNATION
						</Typography>

						<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
							className='logo-small'
							src="/icon-light-2.svg"
							width={40}
							height={40}
							alt="Hospital Logo"
							style={{
								cursor: 'pointer',
								paddingRight: '10px',
							}}
						/>
						<Typography
							variant="h5"
							noWrap
							component="a"
							href=""
							sx={{
								mr: 2,
								display: { xs: 'flex', md: 'none' },
								flexGrow: 1,
								fontWeight: 700,
								color: 'inherit',
								textDecoration: 'none',
							}}
						>
							WELLNATION
						</Typography>
						<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
							{navItems.map((page) => (
								<Button
									key={page.name}
									onClick={() => router.push(`/${page.link}`)}
									sx={{ my: 2, color: 'white', display: 'block' }}
								>
									{page.name}
								</Button>
							))}
						</Box>

						<Box sx={{ flexGrow: 0 }}>
							{user ? <>
								<Tooltip title="Open settings">
									<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
										<Avatar alt="Remy Sharp" src="https://www.w3schools.com/howto/img_avatar.png" />
									</IconButton>
								</Tooltip>
								<Menu
									sx={{ mt: '45px' }}
									id="menu-appbar"
									anchorEl={anchorElUser}
									anchorOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									keepMounted
									transformOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									open={Boolean(anchorElUser)}
									onClose={handleCloseUserMenu}
								>
									{settings.map((item) => (
										<MenuItem key={item.name} onClick={() => { item.click(); handleCloseUserMenu(); }}>
											<Typography textAlign="center">{item.name}</Typography>
										</MenuItem>
									))}
								</Menu>
							</>
								: <Button
									variant="text"
									href="/login"
								>
									<div style={{ color: 'white' }}>Login</div>
								</Button>
							}
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
						display: { xs: 'block', sm: 'none' },
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
					}}
				>
					{drawer}
				</Drawer>
			</Box>
		</>
	);
}
export default Navbar;