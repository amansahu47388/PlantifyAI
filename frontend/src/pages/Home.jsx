import React from 'react';
import HeroSection from '../components/HeroSecton';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Services from '../components/Services';
import Contact from '../components/Contact';


const Home = () => {
  return (
    <div>
      <Header/>
      <HeroSection />
      <Services />
      <Contact />
      <Footer/>
    </div>
  );
};

export default Home;