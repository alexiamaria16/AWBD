import React, {useState} from 'react';
import {Card} from 'primereact/card';
import {Message} from "primereact/message";
import {Button} from "primereact/button";

function FormCard({onSubmit, title = "Register", fields, fieldsState, error, loading, buttonText, className = "", showButton = true}) {
    const [incompleteFieldsError, setIncompleteFieldsError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const isAnyFieldEmpty = Object.entries(fieldsState)
        .filter(([key, value]) => key !== 'postalCode')
        .some(([key, value]) => !value);
        if (isAnyFieldEmpty) {
            setIncompleteFieldsError('Please fill in all fields!');
            return;
        }

        onSubmit(fieldsState);
        setIncompleteFieldsError('');
    };

    let label = loading ? 'Registering...' : 'Register';
    if (buttonText !== '') {
        label = buttonText;
    }

    return (
        <div className={`registerContainer ${className}`.trim()}>
            <div className="formContainer">
                <div className="login-container">
                    <Card>

                        <h2 className="formSubtitle">{title}</h2>
                        <form onSubmit={handleSubmit}>

                            {fields}
                            
                            {incompleteFieldsError ? (
                            <Message severity="error" text={incompleteFieldsError} />
                        ) : (
                            error && <Message severity={/success/i.test(error) ? "success" : "error"} text={error} />
                        )}

                        {showButton && (
                            <Button
                                type="submit"
                                disabled={loading}
                                label={label}
                                className="w-full"
                            />
                        )}


                        </form>

                    </Card>
                </div>
            </div>
        </div>
    );
}

export default FormCard;