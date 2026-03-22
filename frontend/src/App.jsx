import './App.css'
import {Routes, Route} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
  <div>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
    </Routes>

    <Toaster toastOptions={{
        style: {
          background: '#1e2329',
          color: '#b5b8bd',
        },
        duration: 2000,
      }}/>
  </div>
)}
export default App
