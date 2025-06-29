import React, { useEffect, useState, useRef } from 'react';
import { Settings, Edit, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import MovieLoader from './MovieLoader';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [avatar, setAvatar] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    avatar: '',
    coverImage: '',
    bio: '',

  });



  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, postsRes] = await Promise.all([
          axiosInstance.get('/api/v1/users/profileView', {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axiosInstance.get('/api/v1/reviews/getUserReviews', {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        const profileData = profileRes.data?.data?.user;
        const postsData = postsRes.data?.data?.reviews;

        

        if (profileData) {
          setUser(profileData);
          setAvatar(profileData.avatar);
          setCoverImage(profileData.coverImage);
          setFollowerCount(profileRes.data?.data?.follower || 0);
          setFollowingCount(profileRes.data?.data?.following || 0);
        }

        const userPosts = postsRes.data.data;
       
        setPosts(userPosts);
        setPostCount(userPosts.length);
      } catch (err) {

        toast.error('Failed to fetch profile.', {
          style: {
            background: '#1a0b3d',
            color: '#f87171',
            border: '1px solid rgba(251, 113, 133, 0.3)',
            boxShadow: '0 0 15px rgba(251, 113, 133, 0.3)',
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [accessToken, axiosInstance]);

  const toggleMenu = (index) => {
    setMenuOpenIndex((prev) => (prev === index ? null : index));
  };
  const handleDelete = async (reviewId) => {
  const confirmed = window.confirm("Are you sure you want to delete this review?");
  if (!confirmed) return;

  try {
    await axiosInstance.delete(`/api/v1/reviews/deleteReview/${reviewId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    toast.success("Review deleted successfully!", {
      style: {
        background: '#1a0b3d',
        color: '#86efac',
        border: '1px solid rgba(34,197,94,0.3)',
        boxShadow: '0 0 15px rgba(34,197,94,0.3)',
      },
    });

    // 🧠 Remove the deleted review from state
    setPosts((prevPosts) => prevPosts.filter(post => post._id !== reviewId));
    setPostCount(prev => prev - 1);
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to delete review";
    toast.error(msg, {
      style: {
        background: '#1a0b3d',
        color: '#f87171',
        border: '1px solid rgba(251,113,133,0.3)',
        boxShadow: '0 0 15px rgba(251,113,133,0.3)',
      },
    });
  }
};

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading || !user) return <MovieLoader />
  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#2d0072] via-[#a40082] to-[#00b5e0] py-12 text-white px-4 sm:px-6">
      {/* Cover */}

      <div
        className="h-64 bg-cover bg-center z-0 p-12 rounded-lg md:ml-10 md:p-8"
        style={{
          backgroundImage: `url(${coverImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'})`,
        }}
      >

      </div>

      {/* Profile Card */}
      <div className="max-w-5xl mx-auto p-4 -mt-20 z-40">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 md:flex md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-gray-900 shadow-lg"
            />
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-400">@{user.username || user.email?.split('@')[0]}</p>
              <div className="flex gap-6 mt-2 text-sm text-gray-300">
                <span><strong>{postCount}</strong> Posts</span>
                <span><strong>{followerCount}</strong> Fans</span>
                <span><strong>{followingCount}</strong> Following</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setEditForm({ name: user.name || '', username: user.username || '', avatar: user.avatar || '', bio: user.bio || '', coverImage: user.coverImage || '' });
              setIsEditOpen(true);
            }} className="mt-4 md:mt-0 flex items-center gap-2 bg-amber-500 text-gray-900 px-4 py-2 rounded-full hover:bg-amber-600 transition">
            <Edit size={16} /> Edit Profile
          </button>
        </div>
      </div>

      {/* Posts Section with Horizontal Scroll */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Posts</h3>
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
              <ChevronLeft className="text-white" />
            </button>
            <button onClick={() => scroll('right')} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
              <ChevronRight className="text-white" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex overflow-x-auto gap-4 scroll-smooth pb-4 rounded-lg scrollbar-hide">
          {posts.map((post, i) => (
            <div
              key={i}
              className="relative min-w-[250px] bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition flex-shrink-0"
            >
              <img
                src={post.image || `https://source.unsplash.com/random/300x200?sig=${i}`}
                alt="Post"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h4 className="font-semibold text-lg mb-1">{post.movie || `Post #${i + 1}`}</h4>
                <p className="text-yellow-400 text-sm mb-1">⭐ {post.rating}</p>
                <p className="text-sm text-gray-400">{post.comment?.slice(0, 80) || 'No description available.'}</p>
              </div>

              {/* 3-dot menu */}
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => toggleMenu(i)}
                  className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full"
                >
                  <MoreVertical size={18} />
                </button>

                {menuOpenIndex === i && (
                  <div className="absolute right-0 mt-2 w-28 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50">
                    {/* <button onClick={() => alert('Edit')} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">
                      ✏️ Edit
                    </button> */}
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600"
                    >
                      🗑️ Delete
                    </button>

                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white text-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl relative">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

            <div className="space-y-4">

              <div>
                <label className="block font-medium">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-medium">Cover Image</label>
                <input
                  type="file"

                  onChange={(e) => setEditForm({ ...editForm, coverImage: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />


              </div>

              <div>
                <label className="block font-medium">profile</label>
                <input
                  type="file"

                  onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-amber-500 text-white hover:bg-amber-600"
                onClick={async () => {
                  try {
                    await axiosInstance.post(
                      '/api/v1/users/updateprofile',
                      {
                        name: editForm.name,
                        username: editForm.username,
                        avatar: editForm.avatar,
                        coverImage: editForm.coverImage
                      },
                      {
                        headers: { Authorization: `Bearer ${accessToken}` },
                      }
                    );

                    toast.success('Profile updated!');
                    setIsEditOpen(false);
                    window.location.reload(); // or you can just update state locally
                  } catch (err) {
                   
                    toast.error('Failed to update profile');
                  }
                }}
              >
                Save
              </button>
            </div>

            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsEditOpen(false)}
            >
              ✖
            </button>
          </div>
        </div>
      )}

    </div>


  );
};

export default UserProfile;
