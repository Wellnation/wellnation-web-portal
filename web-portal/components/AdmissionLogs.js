import * as React from "react"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import Divider from "@mui/material/Divider"
import ListItemText from "@mui/material/ListItemText"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"

export default function AlignItemsList(props) {
  return (
    <>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        <Typography variant="overline" style={{ margin: "1rem" }}>
          Doctors visited and remarks:
        </Typography>
        {props.log.doctors.map((doctor, index) => (
          <>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={doctor.doctorName.split(" ")[1]} src="#" />
              </ListItemAvatar>
              <ListItemText
                primary={doctor.doctorName}
                secondary={
                  <React.Fragment>
                    {/* <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
                    {Date(doctor.time).toLocaleString() + " :- "}
                  </Typography> */}
                    {doctor.remark}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
        <Typography variant="overline" style={{ margin: "2rem 1rem 1rem 0" }}>
          Medcines :
        </Typography>
      <ul>
        {props.log.meds.map((med, index) => (
          <li key={index}>{med.name}</li>
        ))}
      </ul>
    </>
  )
}
