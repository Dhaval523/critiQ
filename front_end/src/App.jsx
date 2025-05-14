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

const App = () => {

  // useEffect(()=>{
  //   const runFun = async ()=>{
  //     const res = await axios.get("http://localhost:5200")
  //     console.log(res.data);
  //   }
    
  //   runFun()
  // })

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />      
        <Route path="/home" element={<Home />} />
        <Route path="/review" element={<Review />} />
        <Route path="/post" element={<Post />} />
        <Route path='/notifaction' element={<Noti />} />
        <Route path='/profile' element={<ProfilePage />} />
        < Route path='/' element={<CritiQOpening/>} />
      </Routes>
    </Router>


  )
}

export default App
