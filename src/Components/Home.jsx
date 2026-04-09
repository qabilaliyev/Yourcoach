import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';

export default function Home() {
    return (
        <div className="home">
            <Header />
            <Main />
            <Footer />
        </div>
    );
}