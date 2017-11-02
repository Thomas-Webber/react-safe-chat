import React from 'react';

export default class HomeComponent extends React.Component {
    render() {
        return (
            <div>
                <h2>Home</h2>
                <a href="/about">link to about</a>
            </div>
        );
    }
}