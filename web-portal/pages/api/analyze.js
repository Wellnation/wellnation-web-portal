// pages/api/analyze.js
import axios from "axios";

export default async function handler(req, res) {
  try {
    const report = req.body; // Assuming the report data is sent in the request body

    // Make a POST request to the API endpoint
    const response = await axios.post("http://localhost:8000/analyze-report", report);

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      report: "Sorry, an error occurred while analyzing the report.",
      status: "error",
    });
  }
}
