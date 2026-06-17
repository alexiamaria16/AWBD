import React, {useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Card} from 'primereact/card';
import {Message} from 'primereact/message';
import './styles/LoginForm.css';

function OrganizerLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
    
        setLoading(true);
        setError('');
    
        try {
            const response = await fetch('http://localhost:8000/organizerLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
    
            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Response is not JSON:', responseText);
                throw new Error('Server response was not in JSON format');
            }
    
            if (!response.ok) {
                setError(data.message || 'An error occurred');
            } else {
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            }
        } catch (err) {
            setError(err.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='organizerLogin'>
            <div className="formContainer">
                <div className="login-container">
                    <Card>
                        <h2 className="formSubtitle">Organizer Login</h2>
                        <form onSubmit={handleSubmit}>
                        <span className="p-float-label">
                            <InputText
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="email">Email</label>
                        </span>

                            <span className="p-float-label">
                            <InputText
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="password">Password</label>
                        </span>

                            {error && (
                                <Message severity="error" text={error}/>
                            )}

                            
                            <Button
                                type="submit"
                                label="Login"
                                loading={loading}
                                disabled={loading}
                            />

                        </form>
                    </Card>
                </div>
            </div>
        </section>
    );
}

export default OrganizerLogin;