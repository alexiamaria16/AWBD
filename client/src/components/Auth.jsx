import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import './styles/LoginForm.css';
import './styles/Auth.css';

const BASE_URL = 'http://localhost:8000';

const emptyForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    country: '',
    city: '',
    address: '',
    postalCode: '',
    inviteCode: '',
};

function Auth() {
    const [role, setRole] = useState('USER');
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ ...emptyForm });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const set = (id) => (e) => setForm({ ...form, [id]: e.target.value });
    const selectRole = (r) => { setRole(r); setError(''); };
    const selectMode = (m) => { setMode(m); setError(''); };

    const handleLogin = async () => {
        if (!form.email || !form.password) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const endpoint = role === 'ORGANIZER' ? '/organizerLogin' : '/userLogin';
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email: form.email, password: form.password }),
            });
            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch {
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

    const handleRegister = async () => {
        const required = ['firstName', 'lastName', 'email', 'password', 'phoneNumber', 'country', 'city', 'address'];
        if (role === 'ORGANIZER') required.push('inviteCode');
        if (required.some((f) => !form[f])) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const endpoint = role === 'ORGANIZER' ? '/organizerRegister' : '/userRegister';
            const requestData = {
                first_name: form.firstName,
                last_name: form.lastName,
                email: form.email,
                password: form.password,
                phone_number: form.phoneNumber,
                country: form.country,
                city: form.city,
                address: form.address,
                postal_code: form.postalCode,
            };
            if (role === 'ORGANIZER') {
                requestData.invite_code = form.inviteCode;
            }
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });
            const data = await response.json();
            if (!response.ok) {
                if (data.errors) {
                    setError(Object.values(data.errors).join(' '));
                } else {
                    setError(data.message || 'Registration failed');
                }
            } else {
                setError('Registration successful!');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === 'login') {
            handleLogin();
        } else {
            handleRegister();
        }
    };

    const field = (id, label, { type = 'text', span = false, ...extra } = {}) => (
        <span className={`p-float-label${span ? ' span-2' : ''}`} key={id}>
            <InputText id={id} type={type} value={form[id]} onChange={set(id)} {...extra} />
            <label htmlFor={id}>{label}</label>
        </span>
    );

    return (
        <section className="auth">
            <div className="auth-card-wrap">
                <Card className="auth-card">
                    <h2 className="auth-title">Welcome to Events Portal</h2>
                    <p className="auth-subtitle">
                        {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
                    </p>

                    <div className="auth-switch" role="tablist" aria-label="Account type">
                        <button
                            type="button"
                            className={`auth-switch-btn ${role === 'USER' ? 'active' : ''}`}
                            onClick={() => selectRole('USER')}
                        >
                            User
                        </button>
                        <button
                            type="button"
                            className={`auth-switch-btn ${role === 'ORGANIZER' ? 'active' : ''}`}
                            onClick={() => selectRole('ORGANIZER')}
                        >
                            Organizer
                        </button>
                    </div>

                    <div className="auth-tabs">
                        <button
                            type="button"
                            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                            onClick={() => selectMode('login')}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                            onClick={() => selectMode('register')}
                        >
                            Register
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-grid">
                            {mode === 'register' && (
                                <>
                                    {field('firstName', 'First Name')}
                                    {field('lastName', 'Last Name')}
                                </>
                            )}
                            {field('email', 'Email', { type: 'email', span: true })}
                            {field('password', 'Password', { type: 'password', span: true })}
                            {mode === 'register' && (
                                <>
                                    {field('phoneNumber', 'Phone Number', { type: 'tel', inputMode: 'numeric', pattern: '[0-9]*' })}
                                    {field('country', 'Country')}
                                    {field('city', 'City')}
                                    {field('address', 'Address')}
                                    {field('postalCode', 'Postal Code (Optional)', { type: 'tel', inputMode: 'numeric', pattern: '[0-9]*' })}
                                    {role === 'ORGANIZER' && field('inviteCode', 'Invite Code', { span: true })}
                                </>
                            )}
                        </div>

                        {error && (
                            <Message severity={/success/i.test(error) ? 'success' : 'error'} text={error} />
                        )}

                        <Button
                            type="submit"
                            label={mode === 'login' ? 'Login' : 'Create account'}
                            loading={loading}
                            disabled={loading}
                        />
                    </form>

                    <p className="auth-hint">
                        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button type="button" onClick={() => selectMode(mode === 'login' ? 'register' : 'login')}>
                            {mode === 'login' ? 'Register' : 'Login'}
                        </button>
                    </p>
                </Card>
            </div>
        </section>
    );
}

export default Auth;
