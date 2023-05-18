import React from "react";
import Navbar from "./Navbar";
import { useAuth, useLoad, useNavbarState } from "@/lib/zustand.config";
import { Loader } from "./utils";
import { db } from "@/lib/firebase.config";
import { collection, query, getDocs, where } from "firebase/firestore";
import Footer from "./Footer";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
	const router = useRouter();
	const { load } = useLoad();
	const { user, loading } = useAuth();
	const [isLoading, setIsLoading] = React.useState(true);
	const { render, setRender } = useNavbarState((state) => ({
		render: state.render,
		setRender: state.setRender,
	}));
	
	const checkDoctor = async () => {
		const querySnap = await getDocs(
			query(collection(db, "doctors"), where("email", "==", user.email))
		);
		return querySnap.empty ? false : true;
	};

	async function setDoctorId() {
		const querySnap = await getDocs(
			query(collection(db, "doctors"), where("email", "==", user.email))
		);
		const doctorId = querySnap.docs[0].id;
		localStorage.setItem("dId", doctorId);
	}

	async function setId() {
		const querySnap = await getDocs(
			query(collection(db, "users"), where("email", "==", user.email))
		);
		const hospitalId = querySnap.docs[0].id;
		localStorage.setItem("hId", hospitalId);
	}

	React.useEffect(() => {
		if (loading || load) {
			setIsLoading(true);
		} else if (!loading && !load && user) {
			checkDoctor()
				.then((res) => {
					if (res) {
						setDoctorId();
					} else {
						setId();
					}
				})
			setIsLoading(false);
		} else {
			setIsLoading(false);
		}
	}, [loading, load]);

	React.useEffect(() => {
		if (router.pathname.includes("patients")) {
			setRender(false);
		} else {
			setRender(true);
		}
	}, [router.pathname])

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						minHeight: "100vh",
					}}
				>
					{render && <Navbar />}
					<main>{children}</main>
					<Footer />
				</Box>
			)}
		</>
	);
};
export default Layout;
