import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import ProtectedRoutes from "./routes/ProtectedRoutes"
import PublicRoutes from './routes/PublicRoutes'

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route element={<PublicRoutes />} >
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<PublicRoutes />} >
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
