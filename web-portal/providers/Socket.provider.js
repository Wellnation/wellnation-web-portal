import React, { useMemo } from "react";
import { io } from 'socket.io-client';

const SocketContext = React.createContext(null);

export const useSocket = () => React.useContext(SocketContext);

const SocketProvider = (props) => {
  const socket = useMemo(
		() =>
			// io("https://wellnation-socket-server.up.railway.app", {
			io("https://socket.wellnation.live", {
				// io("http://localhost:8001", {
				withCredentials: true
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
