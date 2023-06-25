import React, { useState } from "react";
import { FileInput, rem } from "@mantine/core";
import LoadingButton from "@mui/lab/LoadingButton";
import { FileUpload, BubbleChart, CheckCircle } from "@mui/icons-material";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
	Box,
} from "@mui/material";
import Tesseract from "tesseract.js";
import * as PDFJS from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { StringStream } from "pdfjs-dist/build/pdf.worker";
import axios from "axios";
import {
	collection,
	getDocs,
	where,
	query,
	getDoc,
	doc as firestoreDoc,
	setDoc,
} from "firebase/firestore";
import { db, storage } from "@/lib/firebase.config";
import { uploadBytes, ref } from "firebase/storage";
import { set } from "zod";

PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function TestReport(props) {
	const [text, setText] = useState("");
	const [images, setImages] = useState([]);
	const [llmOutput, setLlmOutput] = useState("");
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [critical, setCritical] = useState(false);

	const convertPDFToImages = async (file) => {
		const reader = new FileReader();
		console.log(file);
		reader.onload = async () => {
			const pdfData = new Uint8Array(reader.result);
			const loadingTask = PDFJS.getDocument(pdfData);
			const pdf = await loadingTask.promise;
			const imagePromises = [];
			for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
				const page = await pdf.getPage(pageNumber);
				const viewport = page.getViewport({ scale: 1.5 });
				const canvas = document.createElement("canvas");
				const context = canvas.getContext("2d");
				canvas.width = viewport.width;
				canvas.height = viewport.height;
				await page.render({ canvasContext: context, viewport }).promise;
				const imageData = canvas.toDataURL("image/png");
				imagePromises.push(imageData);
			}
			const imageUrls = await Promise.all(imagePromises);
			setImages(imageUrls);
			performOCR(imageUrls);
		};
		file && reader.readAsArrayBuffer(file);
	};

	const performOCR = async (imageUrls) => {
		await Tesseract.recognize(imageUrls[0], "eng", {
			tessjs_create_hocr: false,
		})
			.then(async (result) => {
				console.log(String(result.data.text));
				setText(result.data.text);
				axios
					.post("https://wellnation-socket-server.up.railway.app/analyze-report", {
						text: result.data.text,
					})
					.then((output) => {
						setLlmOutput(output.data.report);
						const testsRef = ref(storage, "test-reports/" + file.name);
						uploadBytes(testsRef, file)
							.then((snapshot) => {
								console.log(snapshot);
								const testdocRef = firestoreDoc(
									db,
									"testHistory",
									props.testId
								);
								setDoc(
									testdocRef,
									{
										llmOutput: output.data.report,
										attachment: snapshot.metadata.fullPath,
										status: true,
									},
									{ merge: true }
								);
							})
							.then(() => {
								query({ inputs: output.data.report }).then((response) => {
									console.log(response);
									setCritical(response[0].label === "NEGATIVE" ? false : true);
								});
							})
							.then(() => {
								setOpen(true);
								console.log("done");
								setLoading(false);
								// props.refetchFunc()
							})
							.catch((err) => console.log(err));
					})
					.catch((err) => console.log(err));
			})
			.catch((error) => {
				console.error("Error during OCR:", error);
			});
	};

	async function query(data) {
		const response = await fetch(
			"https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
			{
				headers: {
					Authorization: "Bearer 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",
				},
				method: "POST",
				body: JSON.stringify(data),
			}
		);
		const result = await response.json();
		return result;
	}
	// https://firebasestorage.googleapis.com/v0/b/wellnation-cc1b2.appspot.com/o/test-reports%2FTest_17_06.pdf?alt=media&token=c43d88e2-22f1-4daf-b4a9-49cf87c6aa90

	const handleDocClose = (event, reason) => {
		if (reason !== "backdropClick") {
			props.refetchFunc();
			setOpen(false);
		}
	};

	return (
		<div>
			<FileInput
				accept="application/pdf"
				onChange={(file) => {
					setFile(file);
				}}
				label="Test report"
				placeholder="Select the Report"
				icon={<FileUpload size={rem(14)} />}
			/>
			<LoadingButton
				color="secondary"
				onClick={() => {
					setLoading(true);
					convertPDFToImages(file);
				}}
				loading={loading}
				loadingPosition="start"
				startIcon={<BubbleChart />}
				variant="contained"
			>
				<span>Analyze</span>
			</LoadingButton>
			<Dialog disableEscapeKeyDown open={open} onClose={handleDocClose}>
				<DialogTitle>Test Report summary</DialogTitle>
				<DialogContent>
					<Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
						<Typography variant="h6" style={{ margin: "20px" }}>
							<CheckCircle color="success" fontSize="large" />
							Test report uploaded and analyzed successfully
						</Typography>
						<Typography variant="h5" style={{ margin: "20px" }}>
							Test Report Summary:
						</Typography>
						<Typography variant="caption" style={{ margin: "10px" }}>
							{llmOutput}
						</Typography>
						<Typography variant="h5" style={{ margin: "20px" }}>
							Critical status: {critical ? "Critical" : "Non-Critical"}
						</Typography>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDocClose}>Ok</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
