import { Home, List, Plus, MessageCircle, User } from 'lucide-react'; // Importing icons
import { useNavigate } from "react-router-dom"; 

const Navbar = () => {

  
  const navigate = useNavigate()

  const handleHome = ()=>{
    navigate("/home")
  }

  const handleReview = ()=>{
    navigate("/review")
  }

  const handleChat = ()=>{
    navigate("/notifaction")
  }
  const handleProfile = ()=>{
    navigate("/profile")
  }
  const handlePost = ()=>{
    navigate("/post")
  }
  
  

  return (

   
    <nav className="fixed bottom-0 md:top-0 md:left-0 w-full md:w-16 md:h-full h-16 p-4 bg-black bg-opacity-60 backdrop-blur-lg z-50 flex md:flex-col justify-between items-center">
      
      {/* Navigation Menu */}
      <ul className="flex md:flex-col justify-between items-center w-full md:h-full text-white">
        <li className="cursor-pointer hover:text-cyan-500 flex justify-center p-2"
         onClick={handleReview}>
          <Home size={28} />
        </li>
        <li className="cursor-pointer hover:text-cyan-500 flex justify-center p-2"
        onClick={handleHome}>
          <List size={28} />
        </li>
        <li className="cursor-pointer hover:text-cyan-500 flex justify-center p-2"
            onClick={handlePost}  >
          <Plus size={28} />
        </li>
        <li className="cursor-pointer hover:text-cyan-500 flex justify-center p-2"
         onClick={handleChat }>
          <MessageCircle size={28} />
        </li>
        <li className="cursor-pointer hover:text-cyan-500 flex justify-center p-2"
         onClick={handleProfile}>
          <User size={28} />
        </li>
      </ul>
      
    </nav>
   
  
  )
};

export default Navbar;
