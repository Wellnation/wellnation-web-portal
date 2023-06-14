import React, { useState } from "react"
import { FileInput, rem } from "@mantine/core"
import { FileUpload } from "@mui/icons-material"
import Tesseract from "tesseract.js"
import * as PDFJS from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker

export default function TestReport() {
  const [text, setText] = useState("")
  const [images, setImages] = useState([])

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

  const performOCR = (imageUrls) => {
    Tesseract.recognize(imageUrls[0], "eng", { tessjs_create_hocr: false }) 
      .then((result) => {
        console.log(result.data.text)
        setText(result.data.text)
      })
      .catch((error) => {
        console.error("Error during OCR:", error)
      })
  }

  return (
    <div>
      <FileInput
        onChange={(file) => {
          convertPDFToImages(file)
        }}
        label="Test report"
        placeholder="Upload the Report"
        icon={<FileUpload size={rem(14)} />}
      />
      {images.length > 0 && (
        <div>
          {images.map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl}
              alt={`Page ${index + 1}`}
              style={{ maxWidth: "100%", marginBottom: "10px" }}
            />
          ))}
        </div>
      )}
      {text && (
        <div>
          <h2>Extracted Text:</h2>
          <pre>{text}</pre>
        </div>
      )}
    </div>
  )
}
