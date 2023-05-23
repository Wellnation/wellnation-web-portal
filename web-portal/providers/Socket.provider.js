import React, { useMemo } from "react";
import { io } from 'socket.io-client';

const SocketContext = React.createContext(null);

export const useSocket = () => React.useContext(SocketContext);

const SocketProvider = (props) => {
  const socket = useMemo(
		// () => io("https://wellnationscoketserver-piyushmishra965.b4a.run/"),
		() => io("https://wellnation-socket-server.up.railway.app"),
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
