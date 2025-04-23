import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import TravelerHome from "./pages/TravelerHome";
// importa anche gli altri componenti di destinazione

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TravelerHome />} />
        <Route path="/chats" element={<div>Chat Page</div>} />
        <Route path="/profile" element={<div>Profile Page</div>} />
        <Route path="/discover" element={<div>Discover Page</div>} />
        <Route path="/packages" element={<div>Packages Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


export default App
