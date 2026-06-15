import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import './styles/Navbar.css'
import {FaBars} from 'react-icons/fa'
import {ImCross} from 'react-icons/im'
import {useAuth} from './AuthContext'

function Navbar() {
    const { user } = useAuth();
    const [Mobile, setMobile]  = useState(false);

    return (
        <nav className="navbar">
            <div className='navbarContainer'>
                <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 className='logo'>Events Portal</h3>
                </Link>

                <ul className={Mobile ? "nav-links-mobile" : "nav-links"} onClick={() => {setMobile(false)}}>
                    <li><Link to='/'>Home</Link></li>
                    {user && (
                        <li><Link to='/userEvents'>Events</Link></li>
                    )}
                    {user && user.role === 'ORGANIZER' && (
                        <li><Link to='/organizerDashboard'>Organizer Dashboard</Link></li>
                    )}
                    <li><Link to='/eventsOverview'>Events Overview</Link></li>
                    <li><Link to='/about'>About</Link></li>
                    <li><Link to='/contact'>Contact</Link></li>
                    {!user && (
                        <li><Link to='/login'>Login</Link></li>
                    )}
                    {user && (
                        <li><Link to='/logout'>Log Out</Link></li>
                    )}
                </ul>
                <button className='mobile-menu-icon' onClick={() => setMobile(!Mobile)}>
                    {Mobile ? <ImCross /> : <FaBars />}
                </button>

            </div>
        </nav>
    )
}

export default Navbar
