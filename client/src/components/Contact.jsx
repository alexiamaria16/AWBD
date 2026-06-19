import React, {useState} from 'react';
import './styles/Contact.css';

function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            name: name,
            email: email,
            message: message
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/contactRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            const data = await response.json();
            if (response.ok) {
                console.log(data.message || 'Message sent!');
                alert('Message sent successfully!');
            } else {
                console.log('There was an error: ' + (data.message || 'Unknown error.'));
                alert('There was an error: ' + (data.message || 'Unknown error.'));
            }

            console.log("Response - " + data.message);

        } catch (error) {
            console.log('Error sending the message - ' + error);
        }

        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <section className="contact">
            <form onSubmit={handleSubmit}>
                <h2>Contact Form</h2>
                <div className='input-box'>
                    <label>Full Name</label>
                    <input
                        type='text'
                        className='field'
                        placeholder='Enter your full name'
                        name='name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className='input-box'>
                    <label>Email Address</label>
                    <input
                        type='email'
                        className='field'
                        placeholder='Enter your email'
                        name='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className='input-box'>
                    <label>Your message</label>
                    <textarea
                        name='message'
                        className='field-mess'
                        placeholder='Enter your message'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type='submit'>Send Message</button>
            </form>
        </section>
    );
}

export default Contact;
