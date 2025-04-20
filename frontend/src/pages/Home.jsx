import React from 'react';
import HeroSection from '../components/HeroSecton';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Services from '../components/Services';

const Home = () => {
  return (
    <div>
      <Header/>
      <HeroSection />
      <Services/>
      <Footer/>
    </div>
  );
};

export default Home;