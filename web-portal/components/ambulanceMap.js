import React, { useMemo } from "react";
import {
	useLoadScript,
	GoogleMap,
	MarkerF,
	InfoBox,
	InfoWindow,
} from "@react-google-maps/api";
import { useQuery } from "react-query";
import {
	query,
	collection,
	getDocs,
	getDoc,
	doc as firestoreDoc,
	where,
} from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import Skeleton from "@mui/material/Skeleton";
import ambulanceMarker from "@/public/ambulance.png";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { Item } from "@/pages/home";
import Link from "next/link";
import { Chip } from "@mui/material";

export default function AmbulanceMap() {
	const [center, setCenter] = React.useState({ lat: 0, lng: 0 });
	const hid = localStorage.getItem("hId");
	const libraries = useMemo(() => ["places", "routes"], []);

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
		libraries: libraries,
	});

	async function fetchAmbulance() {
		const ammblRef = query(
			collection(db, "ambulance"),
			where("hid", "==", hid)
		);
		const ammblSnap = await getDocs(ammblRef);
		return ammblSnap.docs.map((doc) => {
			console.log(doc.data());
			return { ...doc.data(), id: doc.id };
		});
	}

	const fetchHospital = async () => {
		const hospRef = firestoreDoc(db, "users", hid);
		const hospSnap = await getDoc(hospRef);
		setCenter({
			lat: hospSnap.data().location.latitude,
			lng: hospSnap.data().location.longitude,
		});
		return { ...hospSnap.data(), id: hospSnap.id };
	};

	const ambulance = useQuery({
		queryKey: ["ambulance"],
		queryFn: fetchAmbulance,
	});
	const hospital = useQuery({
		queryKey: ["hospital"],
		queryFn: fetchHospital,
	});

	const mapOptions = useMemo(
		() => ({
			disableDefaultUI: true, // Disable default UI (use if you want to customize UI)
			clickableIcons: true, // Disable ability to click icons (useful when you have a lot of map markers on the map)
			scrollwheel: false, // Disable scroll to zoom (except for buttons)
			zoomControl: true, // Show zoom control on the map
			streetViewControl: true, // Hide street view control
			fullscreenControl: true, // Show fullscreen control on the map
			mapTypeControl: true, // Show map type control (e.g., satellite, terrain)
			gestureHandling: "auto", // Enable default gesture handling
			minZoom: 5, // Set the minimum allowed zoom level
			maxZoom: 20, // Set the maximum allowed zoom level
			zoom: 14, // Set the zoom level
			mapTypeId: "roadmap", // Set the default map type (e.g., roadmap, satellite, hybrid)
			backgroundColor: "#f2f2f2", // Set the background color of the map tiles
			styles: [
				// Apply custom styles to the map
				{
					featureType: "poi",
					elementType: "labels",
					stylers: [{ visibility: "on" }],
				},
				{
					elementType: "geometry",
					stylers: [
						{
							color: "#242f3e",
						},
					],
				},
				{
					elementType: "labels.text.fill",
					stylers: [
						{
							color: "#746855",
						},
					],
				},
				{
					elementType: "labels.text.stroke",
					stylers: [
						{
							color: "#242f3e",
						},
					],
				},
				{
					featureType: "administrative.locality",
					elementType: "labels.text.fill",
					stylers: [
						{
							color: "#d59563",
						},
					],
				},
			],
		}),
		[]
	);

	function handleMarkerClick() {
		return (
			<InfoWindow position={center}>
				{console.log("InfoWindow")}
				<div>
					<h1>InfoWindow</h1>
				</div>
			</InfoWindow>
		);
	}

	if (!isLoaded || ambulance.isLoading || hospital.isLoading) {
		return (
			<Skeleton
				sx={{ bgcolor: "grey" }}
				variant="rectangular"
				width="80vw"
				height="80vh"
			/>
		);
	}

	if (loadError || ambulance.error || hospital.error) {
		return <p>Error loading map...</p>;
	}

	return (
		<>
			<GoogleMap
				options={mapOptions}
				zoom={14}
				center={center}
				mapTypeId="ROADMAP"
				mapContainerStyle={{ width: "80vw", height: "80vh" }}
				onLoad={() => console.log("Map Component Loaded...")}
			>
				{ambulance.data.map((amb) => (
					<div>
						<MarkerF
							key={amb.id}
							position={{
								lat: amb.currentlocation.latitude,
								lng: amb.currentlocation.longitude,
							}}
							icon={ambulanceMarker}
							animation="BOUNCE"
						/>
						<InfoBox
							style={{
								width: "auto",
							}}
							position={{
								lat: amb.currentlocation.latitude,
								lng: amb.currentlocation.longitude,
							}}
						>
							<Item
								style={{
									minWidth: "200px",
								}}
							>
								<span
									style={{
										color: "black",
										fontWeight: "bold",
										fontSize: "1rem",
									}}
								>
									{amb.driverName}
								</span>{" "}
								<br />
								<span
									style={{
										color: "black",
										fontSize: "1rem",
									}}
								>
									Vehicle No: {amb.vechilenumber}
								</span>{" "}
								<br />
								<span
									style={{
										color: "black",
									}}
								>
									Contact:{" "}
									<b>
										<Link href={`tel:${amb.contact}`}>{amb.contact}</Link>
									</b>
								</span>{" "}
								<br />
								{amb.status ? (
									<Chip label="Available" color="success" variant="outlined" />
								) : (
									<Chip label="Assigned" color="error" variant="outlined" />
								)}
							</Item>
						</InfoBox>
					</div>
				))}
				<MarkerF
					position={center}
					onLoad={() => console.log("Marker Loaded")}
					onClick={handleMarkerClick}
					icon={{
						url: LocalHospitalIcon,
						fillColor: "yellow",
						strokeColor: "gold",
						strokeWeight: 2,
					}}
				/>
				<InfoBox position={center}>
					<div
						style={{
							backgroundColor: "#FFC107",
							opacity: 0.75,
							padding: "1rem",
						}}
					>
						<div
							style={{
								fontSize: "1rem",
								fontColor: `#000`,
								fontWeight: "bold",
							}}
						>
							Hospital location
						</div>
					</div>
				</InfoBox>
			</GoogleMap>
		</>
	);
}
