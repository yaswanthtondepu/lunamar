import React, { useEffect } from "react";
import Navbar from "./Navbar";
import '../css/home.css';
import homeImage from '../assets/images/home.jpg';

const Home = () => {
  const styles = {
    backgroundImage: `url(${homeImage})`
  }
  // useEffect(() => { setTimeout(showSlides, 4000); })
  const imgStyle = {
    width: "100%",
    height: "100%",
    backgroundSize: "cover"
  };
  return (
    <>
      <Navbar></Navbar>
      <div className="home-content" style={{ overflow: 'hidden', height: '100%' }}>
        <div className="home-container">

          <div className="homeImage" style={styles}>
            <div className="text">AS WE EVOLVE, OUR HOMES SHOULD TOO</div>
          </div>

          {/* <div className="image-sliderfade fade">
            <img
              src="../assets/images/home2.jpg"
              style={imgStyle}
            />
            <div className="text">AS WE EVOLVE, OUR HOMES SHOULD TOO</div>
          </div>

          <div className="image-sliderfade fade">
            <img
              src="../assets/images/home3.jpg"
              style={imgStyle}
            />
            <div className="text">AS WE EVOLVE, OUR HOMES SHOULD TOO</div>
          </div> */}
        </div>

        {/* <div style={{ textAlign: "center" }}>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div> */}
      </div>
    </>
  )
}

export default Home;