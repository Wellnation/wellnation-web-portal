import React, { useState } from "react"
import { FileInput, rem } from "@mantine/core"
import LoadingButton from "@mui/lab/LoadingButton"
import { FileUpload, BubbleChart } from "@mui/icons-material"
import Tesseract from "tesseract.js"
import * as PDFJS from "pdfjs-dist"
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry"
import { StringStream } from "pdfjs-dist/build/pdf.worker"
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker
import axios from "axios"
import { collection, getDocs, where, query, getDoc, doc as firestoreDoc, setDoc } from "firebase/firestore"
import { db, storage } from "@/lib/firebase.config"
import { uploadBytes, ref } from "firebase/storage"

export default function TestReport(props) {
  const [text, setText] = useState("")
  const [images, setImages] = useState([])
  const [llmOutput, setLlmOutput] = useState("")
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const convertPDFToImages = async (file) => {
    const reader = new FileReader()
    console.log(file)
    reader.onload = async () => {
      const pdfData = new Uint8Array(reader.result)
      const loadingTask = PDFJS.getDocument(pdfData)
      const pdf = await loadingTask.promise
      const imagePromises = []
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber)
        const viewport = page.getViewport({ scale: 1.5 })
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        canvas.width = viewport.width
        canvas.height = viewport.height
        await page.render({ canvasContext: context, viewport }).promise
        const imageData = canvas.toDataURL("image/png")
        imagePromises.push(imageData)
      }
      const imageUrls = await Promise.all(imagePromises)
      setImages(imageUrls)
      performOCR(imageUrls)
    }
    file && reader.readAsArrayBuffer(file)
  }

  const performOCR = async (imageUrls) => {
    await Tesseract.recognize(imageUrls[0], "eng", { tessjs_create_hocr: false })
      .then(async (result) => {
        console.log(String(result.data.text))
        setText(result.data.text)
        axios
          .post("http://localhost:8000/analyze-report", { text: result.data.text })
          .then((output) => {
            console.log(output.data.report)
            setLlmOutput(output.data.report)
          })
          .then(() => {
            const testsRef = ref(storage, "test-reports/" + file.name)
            uploadBytes(testsRef, file)
              .then((snapshot) => {
                console.log(snapshot)
                const testdocRef = firestoreDoc(db, "testHistory", props.testId)
                setDoc(testdocRef, { llmOutput: llmOutput, attachment: snapshot.metadata.fullPath, status: true }, { merge: true })
              })
              .then(() => {
                props.refetchFunc()
                setLoading(false)
              })
              .catch((err) => console.log(err))
          })
          .catch((err) => console.log(err))
      })
      .catch((error) => {
        console.error("Error during OCR:", error)
      })
  }

  return (
    <div>
      <FileInput
        accept="application/pdf"
        onChange={(file) => {
          setFile(file)
        }}
        label="Test report"
        placeholder="Select the Report"
        icon={<FileUpload size={rem(14)} />}
      />
      <LoadingButton
        color="secondary"
        onClick={() => {
          setLoading(true)
          convertPDFToImages(file)
        }}
        loading={loading}
        loadingPosition="start"
        startIcon={<BubbleChart />}
        variant="contained"
      >
        <span>Analyze</span>
      </LoadingButton>
    </div>
  )
}
