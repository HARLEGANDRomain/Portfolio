import React, { useEffect } from 'react'
import './App.css'
import GwidoPortfolio from './components/GwidoPortfolio'

function App() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-client-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-client-y', `${e.clientY}px`);
      document.documentElement.style.setProperty('--mouse-page-x', `${e.pageX}px`);
      document.documentElement.style.setProperty('--mouse-page-y', `${e.pageY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
      <GwidoPortfolio />
  )
}

export default App
