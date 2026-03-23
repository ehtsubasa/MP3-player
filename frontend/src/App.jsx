import './App.css'
import {Routes, Route} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';

import Home from './pages/main/Home';
import Login from './pages/authentication/Login';
import Signup from './pages/authentication/Signup';
import Playlist from './pages/main/Playlist';
import Playing from './pages/main/Playing';
import Search from './pages/main/Search';

function App() {

  const { authUser, checkingAuth } = useAuthContext();

  if (checkingAuth) {
    return (
      <div className='min-h-screen bg-black text-white flex items-center justify-center'>
        Checking session...
      </div>
    );
  }

  return (
  <div>
    <Routes>
      <Route path='/'  element={authUser ? <Home /> : <Navigate to='/login' /> } />
      <Route path='/login'  element={authUser ? <Navigate to='/' /> : <Login />} />
      <Route path='/signup' element={authUser ? <Navigate to='/' /> : <Signup/>} />
      <Route path='/playlist' element={authUser ? <Playlist /> : <Navigate to='/login' /> } />
      <Route path='/playing' element={authUser ? <Playing /> : <Navigate to='/login' /> } />
      <Route path='/search' element={authUser ? <Search /> : <Navigate to='/login' /> } />
    </Routes>

    <Toaster toastOptions={{
        style: {
          background: '#f97316',
          color: '#ffffff',
        },
        duration: 2000,
      }}/>
  </div>
)}
export default App
