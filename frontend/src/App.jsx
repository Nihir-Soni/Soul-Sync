import React from 'react'
import {Route,Routes} from 'react-router';
import LandingPage from './pages/LandingPage';

import Diary from './pages/Diary';
import ProtectedRoute from './components/ProtectedRoute';
import DiaryHistory from './components/DiaryHistory';

const App = () => {
  return (
    <div className=''>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route 
          path="/diary" 
          element={
            <ProtectedRoute>
              <Diary />
            </ProtectedRoute>
          } 
        />
       {/*<Route path="/history" element={<DiaryHistory/>} />*/} 
      </Routes>
    </div>
  )
}

export default App
