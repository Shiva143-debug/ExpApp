import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import AddCategory from "./AddCategory";
import Source from "./Source";
import Login from "./Login";
import DashBoard from "./DashBoard";
import Reports from "./Reports";
import Additems from "./Additems";
import { useEffect, useState } from "react";
import Header from "./Header";
import useMediaQuery from '@mui/material/useMediaQuery';
import Footer from "./Footer";
import { useLocation } from 'react-router-dom';
import ImageComponent from "./ImageComponent";
import Report from "./Report";

function Layout({ children, id, isdark, toggleTheme }) {

  const location = useLocation();
  const isLoginRoute = location.pathname === '/';
  const isMobile = useMediaQuery('(max-width:768px)');
  return (
    <>
      {!isLoginRoute && <Header id={id} isdark={isdark} toggleTheme={toggleTheme}/>}
      {children}
      {isMobile && (
        <div>
          <Footer class="mt-5"/>
        </div>
      )}
    </>
  );
}

function App() {
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId');
  });

  const [isdark, setDark] = useState(false);

  const toggleTheme = () => {
    setDark(!isdark);
  };
  
  useEffect(() => {
    document.title = "Expenditure application";
  }, []);

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setUserId={setUserId} />} />
        <Route path="/dashBoard" element={<Layout id={userId}  isdark={isdark} toggleTheme={toggleTheme}><DashBoard id={userId} isdark={isdark}/></Layout>} />
        <Route path="/additems" element={<Layout id={userId}  isdark={isdark} toggleTheme={toggleTheme}><Additems id={userId}  isdark={isdark}/></Layout>} />
        <Route path="/addcat" element={<Layout id={userId}  isdark={isdark} toggleTheme={toggleTheme}><AddCategory id={userId} isdark={isdark}/></Layout>} />
        <Route path="/source" element={<Layout id={userId}  isdark={isdark} toggleTheme={toggleTheme}><Source id={userId} isdark={isdark}/></Layout>} />
        <Route path="/reports" element={<Layout id={userId} isdark={isdark}  toggleTheme={toggleTheme}><Reports id={userId} isdark={isdark}/></Layout>} />
        {/* <Route path="/report" element={<Layout id={userId} isdark={isdark}  toggleTheme={toggleTheme}><Report id={userId} isdark={isdark}/></Layout>} /> */}
        <Route path="/image" element={<ImageComponent/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


// function App() {
//   const [userId, setUserId] = useState(() => {
//     return localStorage.getItem('userId');
//   });

//   useEffect(() => {
//     document.title = "Expenditure application";
//   }, []);

//   useEffect(() => {
//     if (userId) {
//       localStorage.setItem('userId', userId);
//     } else {
//       localStorage.removeItem('userId');
//     }
//   }, [userId]);

//   return (
//     <BrowserRouter>
//       <Header id={userId} />
//       <Routes>
//         <Route path="/" element={<Login setUserId={setUserId} />} />
//         <Route path="/dashBoard" element={<DashBoard id={userId} />} />
//         <Route path="/additems" element={<Additems id={userId} />} />
//         <Route path="/addcat" element={<AddCategory id={userId} />} />
//         <Route path="/source" element={<Source id={userId} />} />
//         <Route path="/reports" element={<Reports id={userId} />} />
//       </Routes>
//       {/* <Footer /> */}
//     </BrowserRouter>
//   );
// }

// export default App;



