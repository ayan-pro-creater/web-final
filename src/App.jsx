import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <h1 className="bg-red">Hello Developer!</h1>
      {/* ToastContainer allows toasts to display globally */}
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;

