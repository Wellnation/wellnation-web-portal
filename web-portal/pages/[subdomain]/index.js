import TestHistory from "@/components/TestHistory";
import { useRouter } from "next/router";
import React from "react";
import { useAdminMode } from "@/lib/zustand.config";

export default function SubHome() {
	const router = useRouter();
	const { subdomain } = router.query;
	const [scopes, setScopes] = React.useState(
		localStorage.getItem("scopes").split(",")
  );
  const { adminMode, setAdminMode } = useAdminMode();

	React.useEffect(() => {
		if (!localStorage.getItem("hId") || !localStorage.getItem("aId")) {
			window.location.href = window.location.origin + "/login";
    }
    setAdminMode(true);
	}, []);

	return (
		<div>
			{scopes.includes("beds") && scopes.length < 2 ? (
				<div>
					<h1>Beds</h1>
				</div>
			) : scopes.includes("tests") && scopes.length < 2 ? (
				<div>
					<TestHistory />
				</div>
			) : scopes.length === 2 ? (
				<div>
					<h1>Both beds and tests</h1>
				</div>
			) : (
				<div>No scopes</div>
			)}
		</div>
	);
}
