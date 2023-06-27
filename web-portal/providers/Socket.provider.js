import React, { useMemo } from "react";
import { io } from 'socket.io-client';

const SocketContext = React.createContext(null);

export const useSocket = () => React.useContext(SocketContext);

const SocketProvider = (props) => {
  const socket = useMemo(
		() =>
			// io("https://wellnation-socket-server.up.railway.app", {
			io("http://35.232.243.162", {
				// io("http://localhost:8001", {
				withCredentials: true,
				extraHeaders: {
					// "Access-Control-Allow-Origin": "http://localhost:3000",
					"Access-Control-Allow-Origin": "https://wellnation.live",
					"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
					"Access-Control-Allow-Headers":
						"Content-Type, Authorization, Access-Control-Allow-Origin",
				},
			}),
		// () => io("localhost:8001"),
		[]
	);

  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
