import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import Categories from './components/Categories/Categories'
import Foods from './components/Foods/Foods'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Navigate} from "react-router-dom"


function App() {
  const queryClient = new QueryClient();


  return (
  <QueryClientProvider client={queryClient}>
      <Sidebar></Sidebar>
    <Routes>
      <Route path="/" element={<Navigate to="/Categories" />} />

      <Route path="/Categories" element={<Categories />} />
      <Route path="/Foods" element={<Foods />}></Route>
    </Routes>
    </QueryClientProvider>
  )
}

export default App
