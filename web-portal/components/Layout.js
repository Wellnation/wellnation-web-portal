import React from "react";
import Navbar from "./Navbar";
import { useAuth } from "@/lib/zustand.config";
import { Loader } from "./utils";
import { db } from "@/lib/firebase.config";
import { collection, query, getDocs, where } from "firebase/firestore";
import Footer from "./Footer";
import Box from "@mui/material/Box";

const Layout = ({ children }) => {
	const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);

	const checkDoctor = async () => {
		const querySnap = await getDocs(
			query(collection(db, "doctors"), where("email", "==", user.email))
		);
		return querySnap.empty ? false : true;
	};

	React.useEffect(() => {
		if (loading) {
			setIsLoading(true);
		} else {
			if (checkDoctor) {
				async function setDoctorId() {
					const querySnap = await getDocs(
						query(collection(db, "doctors"), where("email", "==", user.email))
					);
					const doctorId = querySnap.docs[0].id;
					localStorage.setItem("dId", doctorId);
				}
				user && setDoctorId();
				setIsLoading(false);
			} else {
				async function setId() {
					const querySnap = await getDocs(
						query(collection(db, "users"), where("email", "==", user.email))
					);
					const hospitalId = querySnap.docs[0].id;
					localStorage.setItem("hId", hospitalId);
				}
				user && setId();
				setIsLoading(false);
			}
		}
	}, [loading]);

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
					<Navbar />
					<main>{children}</main>
					<Footer />
				</Box>
			)}
		</>
	);
};
export default Layout;
