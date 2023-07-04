import MemeGenerator from './MemeGenerator'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  
  return (
    <>
      <MemeGenerator />
      <ToastContainer position="top-right" />
    </>
  )
}

export default App
