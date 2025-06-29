import React from 'react'
import Home from './sections/Home'
import Review from './sections/Review'
import Noti from './sections/Notifaction';
import Post from './sections/Post';
import SignUp from './sections/SignUp';
import Login from './sections/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfilePage from './sections/ProfilePage';
import CritiQOpening from './sections/Homepage';
import MainPage from './sections/MainPage';
import MovieLoader from './components/MovieLoader';
import About from './sections/about';
import { Toaster } from 'react-hot-toast';

const App = () => {


  return (
    <Router>
       <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
      />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />      
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/review" element={<Review />} />
        <Route path="/post" element={<Post />} />
        <Route path='/notifaction' element={<Noti />} />
        <Route path='/profile' element={<ProfilePage />} />
        < Route path='/' element={<CritiQOpening/>} />
        <Route path='/home' element={<MainPage />} />
        <Route path='/loader' element={<MovieLoader />} />
        <Route path='/about' element={<About />} />
        
      </Routes>
    </Router>


  )
}

export default App
