import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router';
import Login from '../src/pages/Login'
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import Home from './pages/Home'
import Navbar from './components/Navbar';
import ProtectedRoutes from './components/ProtectedRoutes';
import Singlepost from './pages/Singlepost';
import UpdatePost from './pages/UpdatePost';


const App = () => {
  return (
   <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/posts/:id' element={<Singlepost/>}/>
        <Route path='/update-post/:id' element={<UpdatePost/>}/>
        <Route path='/create-post'
        element={
          <ProtectedRoutes>
            <CreatePost/>
          </ProtectedRoutes>
        }/>
      </Routes>
   </BrowserRouter>
  )
}

export default App
