import React, {useState} from 'react';
import FormCard from './FormCard.jsx';
import {InputText} from 'primereact/inputtext';
import './styles/FormCard.css';
import './UserRegister.jsx';
import { useFormFields } from './UserRegister.jsx';

function OrganizerRegister() {
    const {fields, fieldsState} = useFormFields();
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const organizerFields = (
        <>
        {fields}
        <span className="p-float-label">
            <InputText
                type="text"
                id="inviteCode"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
            />
            <label htmlFor="inviteCode">Invite Code</label>
        </span>
        </>
    );

    const organizerFieldsState = {
        ...fieldsState,
        inviteCode,
    };

    
    const handleSubmit = async (formData) => {
        console.log('Organizer register form submitted:', formData);
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
                invite_code: inviteCode,
            };

            const response = await fetch('http://localhost:8000/organizerRegister', {
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
        <section className="organizerRegister">
            <FormCard onSubmit={handleSubmit} title="Organizer Register" fields={organizerFields} fieldsState={organizerFieldsState}
                error={error} loading={loading} buttonText='' />
        </section>
    );
}

export default OrganizerRegister;
