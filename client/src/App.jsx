import React from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./components/Home.jsx";
import UserEvents from "./components/UserEvents.jsx";
import EventsOverview from './components/EventsOverview';
import OrganizerDashboard from "./components/OrganizerDashboard.jsx";
import OrganizerRegister from "./components/OrganizerRegister.jsx";
import OrganizerLogin from "./components/OrganizerLogin.jsx";
import UserRegister from './components/UserRegister';
import UserLogin from "./components/UserLogin.jsx";
import About from './components/About';
import Contact from './components/Contact';
import Auth from './components/Auth.jsx';
import NotFound from './components/NotFound.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { AuthProvider } from './components/AuthContext.jsx';
import Logout from './components/Logout.jsx';

function App() {
    return (
        <AuthProvider>
            <Router>
            <Navbar />

                <ErrorBoundary>
                    <Routes>
                        <Route path='/' element={<Home/>}/>
                        <Route path='/login' element={<Auth/>}/>
                        <Route path='/userEvents' element={<UserEvents/>}/>
                        <Route path='/eventsOverview' element={<EventsOverview/>}/>
                        <Route path='/organizerDashboard' element={<OrganizerDashboard/>}/>
                        <Route path='/organizerRegister' element={<OrganizerRegister/>}/>
                        <Route path='/organizerLogin' element={<OrganizerLogin/>}/>
                        <Route path='/userRegister' element={<UserRegister/>}/>
                        <Route path='/userLogin' element={<UserLogin/>}/>
                        <Route path='/about' element={<About/>}/>
                        <Route path='/contact' element={<Contact/>}/>
                        <Route path='/logout' element={<Logout/>}/>
                        <Route path='*' element={<NotFound/>}/>
                    </Routes>
                </ErrorBoundary>
            </Router>
        </AuthProvider>
    )
}

export default App
