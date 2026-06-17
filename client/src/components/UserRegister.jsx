import React, {useState} from 'react';
import FormCard from './FormCard.jsx';
import './styles/FormCard.css';
import {InputText} from "primereact/inputtext";

export const useFormFields = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const fieldsState = {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        country,
        city,
        address,
        postalCode,
    };

    const fields = (
        <>
            <span className="p-float-label">
                        <InputText
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <label htmlFor="firstName">First Name</label>
            </span>

            <span className="p-float-label">
                        <InputText
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <label htmlFor="lastName">Last Name</label>
            </span>

            <span className="p-float-label">
                        <InputText
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="email">Email</label>
            </span>

            <span className="p-float-label">
                        <InputText
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="password">Password</label>
            </span>

            <span className="p-float-label">
                        <InputText
                            type="tel"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <label htmlFor="phoneNumber">Phone Number</label>
                    </span>

            <span className="p-float-label">
                        <InputText
                            type="text"
                            id="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                        <label htmlFor="country">Country</label>
                    </span>

            <span className="p-float-label">
                        <InputText
                            type="text"
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                        <label htmlFor="city">City</label>
                    </span>

            <span className="p-float-label">
                        <InputText
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <label htmlFor="address">Address</label>
                    </span>

            <span className="p-float-label">
                        <InputText
                            type="tel"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            id="postalCode"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                        />
                        <label htmlFor="postalCode">Postal Code (Optional)</label>
                    </span>

        </>
    );

    return {fields, fieldsState};
}

function UserRegister() {
    const { fields, fieldsState } = useFormFields();
     const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (formData) => {
        console.log('User register form submitted:', formData);
        setLoading(true);
        setError(null);
        
        try {
            const requestData = {
                first_name: fieldsState.firstName,
                last_name: fieldsState.lastName,
                email: fieldsState.email,
                password: fieldsState.password,
                phone_number: fieldsState.phoneNumber,
                country: fieldsState.country,
                city: fieldsState.city,
                address: fieldsState.address,
                postal_code: fieldsState.postalCode,
            };

            const response = await fetch('http://localhost:8000/userRegister', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();

            if (!response.ok) {
                
                if (data.errors) {
                    const errorMessages = Object.values(data.errors).join(' ');
                    setError(errorMessages);
                } else {
                    setError(data.message || 'Registration failed');
                    console.log(data.message || 'Registration failed');
                }

            } else {
                console.log('Registration successful:', data);
                setError("Registration successful!");
            }

            
        } catch (err) {
            setError(err.message);
            console.log('Registration error:', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
            <section className="userRegister">
                <FormCard onSubmit={handleSubmit} title='User Register' fields={fields} fieldsState={fieldsState} 
                    error={error} loading={loading} buttonText='' />
            </section>
    );
}

export default UserRegister;
