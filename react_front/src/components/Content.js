import React from 'react';

const Content = props => {
    return (
        <div className="content">
            <h2>Welcome, {props.user.name}</h2>
            <p>Your email address is: {props.user.email}</p>
            <p>You have a cookie set to: {props.user.token}</p>
            <button onClick={props.logout}>Click here to log out!</button>
        </div>
    )
}

export default Content;
