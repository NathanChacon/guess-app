


import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const App: React.FC = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
    },
  ]);
  return (
    <>
     <RouterProvider router={router} />
    </>
  )
};


export default App;
