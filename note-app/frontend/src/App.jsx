import { Routes, Route } from 'react-router-dom';  
import UserLogin from './pages/UserLogin';
import UserLogout from './pages/UserLogout';
import UserProtectWrapper from './pages/UserProtectWrapper';
import Start from './pages/Start';
import Home from './pages/Home';
import UserSignup from './pages/UserSignup';
import FullNote from './pages/FullNote';  // Import FullNote component

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/home' element={
          <UserProtectWrapper>
            <Home />
          </UserProtectWrapper>
        } />
        <Route path='/user/logout' element={
          <UserProtectWrapper>
            <UserLogout />
          </UserProtectWrapper>
        } />
        <Route path='/note/:id' element={<FullNote />} /> {/* Route for full note view */}
      </Routes>
    </div>
  );
}

export default App;
