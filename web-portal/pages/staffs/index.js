import TestHistory from "@/components/TestHistory";
import { useRouter } from "next/router";
import React from "react";
import { useAdminMode } from "@/lib/zustand.config";
import { useQuery } from "react-query";
import { Loader } from "@/components/utils";
import BedsManager from "@/components/BedsManager";
import { Typography } from "@mui/material";

export default function SubHome() {
	const router = useRouter();
	const { subdomain } = router.query;
	const [scopes, setScopes] = React.useState([]);
	const { adminMode, setAdminMode } = useAdminMode();

	const {
		data: staffData,
		isLoading,
		error,
	} = useQuery("[staff]", () => {
		if (!localStorage.getItem("hId") || !localStorage.getItem("aId")) {
			window.location.href = window.location.origin + "/login";
		} else {
			setScopes(localStorage.getItem("scopes").split(","));
			setAdminMode(true);
		}
	});

	if (isLoading) return <Loader />;

	return (
		<div
			style={{
				margin: "auto",
				padding: "30px",
			}}
		>
			{isLoading || !localStorage.getItem("scopes") ? (
				<Loader />
			) : scopes.includes("beds") && scopes.length < 2 ? (
				<div>
					<BedsManager />
				</div>
			) : scopes.includes("tests") && scopes.length < 2 ? (
				<div>
					<TestHistory />
				</div>
			) : scopes.length === 2 ? (
				<div>
					<BedsManager />
				</div>
			) : (
				<div>
					<Typography variant="h3" style={{ fontWeight: "bold" }}>
						No Access scopes assigned for this account. Please contact your
						hospital administrator for this issue.
					</Typography>
				</div>
			)}
		</div>
	);
}
