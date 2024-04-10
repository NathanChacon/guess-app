


import React, { useEffect } from 'react';
import Home from './pages/Home';
import Room from './pages/Room';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { socket } from './socket';
const App: React.FC = () => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log("user connected")
    })

    return (() => {
      socket.off('connect')
    })
  }, [])
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
    },
    {
      path: "rooms/:roomId",
      element: <Room />,
    },
  ]);
  return (
    <>
     <RouterProvider router={router} />
    </>
  )
};


export default App;
