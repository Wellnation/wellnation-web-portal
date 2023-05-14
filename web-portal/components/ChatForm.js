import React from 'react'
import {
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: theme.palette.text.secondary,
	height: "100%",
}));

const ChatForm = () => {
  return (
    <div>
      <Item>
        <h1> Form</h1>
      </Item>
    </div>
  )
}

export default ChatForm