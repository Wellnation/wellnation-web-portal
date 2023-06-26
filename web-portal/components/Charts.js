import React from "react"
import { Scatter } from "react-chartjs-2"
import chart from "chart.js/auto"
import { Paper } from "@mui/material"
import { useQuery } from "react-query"
import { db } from "@/lib/firebase.config"
import { collection, getDocs, query, where } from "firebase/firestore"
import moment from "moment"
import "chartjs-adapter-moment"

const options = {
  scales: {
    x: {
      type: "linear",
      position: "bottom",
      min: -5,
      max: 5,
      title: {
        display: true,
        text: "Days",
      },
    },
    y: {
      type: "linear",
      // min: 0,
      max: 24,

      title: {
        display: true,
        text: "Hours",
      },
    },
  },
  maintainAspectRatio: false, // disable aspect ratio to allow width customization
  responsive: true,
}

export default function ScatterGraph() {
  const [dataset1, setDataset1] = React.useState([{ x: 0, y: "8:00 am" }])
  const [dataset2, setDataset2] = React.useState([{ x: 0, y: "8:00 am" }])
  const [labels1, setLabels1] = React.useState([""])
  const hId = localStorage.getItem("hId")
  const today = new Date()
  const appt = useQuery({
    queryKey: ["appointments"],
    queryFn: fetchApt,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  })

  async function fetchApt() {
    const q = query(collection(db, "appointments"), where("hid", "==", hId))
    const querySnapshot = await getDocs(q)
    const data = querySnapshot.docs.map((doc) => doc.data())
    const graphData = data.map((apt) => {
      const labels1 = apt.dept
      const stime = (apt.shldtime.toDate() - today) / (1000 * 60 * 60 * 24)
      const rtime = (apt.reqtime.toDate() - today) / (1000 * 60 * 60 * 24)
      const d1 = {
        x: stime < 0 ? (apt.status ? -6 : rtime) : -6,
        y: apt.reqtime.toDate().getHours(),
      }
      const d2 = {
        x: stime < 0 ? (apt.status ? stime : -6) : stime,
          y: apt.shldtime.toDate().getHours(),
      }
      return {
        d1: d1,
        d2: d2,
        l1: labels1,
      }
    })
    setDataset1(graphData.map((apt) => apt.d1))
    setDataset2(graphData.map((apt) => apt.d2))
    setLabels1(graphData.map((apt) => apt.l1))
    return graphData
  }

  console.log()
  const data = {
    labels: labels1,
    datasets: [
      {
        label: "Requested time",
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#f0f9ff",
        pointBorderWidth: 3,
        pointHoverRadius: 15,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHitRadius: 20,
        data: dataset1,
      },
      {
        label: "Scheduled time",
        fill: false,
        backgroundColor: "#ffc107",
        pointBorderColor: "#ffc408",
        pointBackgroundColor: "#f0f9ff",
        pointBorderWidth: 3,
        pointHoverRadius: 15,
        pointHoverBackgroundColor: "#ffc107",
        pointHoverBorderColor: "#ffc408",
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHitRadius: 20,
        data: dataset2,
      },
    ],
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper elevation={0} sx={{ width: "100%", height: "50vh" }} style={{ margin: "1rem 5rem 1rem 5rem", padding: "1rem 2rem" }}>
        {appt.data && <Scatter data={data} width="100%" options={options} />}
      </Paper>
    </div>
  )
}
