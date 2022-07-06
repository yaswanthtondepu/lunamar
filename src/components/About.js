import React from "react";
import '../css/styles.css';
import '../css/about.css';
import Navbar from "./Navbar";

const About = () => {
  return (
    <>
      <Navbar></Navbar>
      <div className="main-div">
        <div className="main-title">About Us</div>
        <div className="about-content">
          <div className="about-single-option">
            <div>
              <img src="../assets/images/courtyard.png" className="info-image" />
            </div>
            <div className="info-div">
              <div className="info">Jaw-dropping courtyard</div>
              <div className="more-info">
                Resort style swimming pool, cabanas, outdoor kitchen, fire pit &amp;
                lounge area
              </div>
            </div>
          </div>
          <div className="about-single-option">
            <div>
              <img src="../assets/images/game_room.png" className="info-image" />
            </div>
            <div className="info-div">
              <div className="info">Tricked out game room</div>
              <div className="more-info">
                Theater, gaming consoles, bar &amp; plenty of room to mingle
              </div>
            </div>
          </div>
          <div className="about-single-option">
            <div>
              <img src="../assets/images/fitness_center.png" className="info-image" />
            </div>
            <div className="info-div">
              <div className="info">Fully-loaded fitness center</div>
              <div className="more-info">
                Free weights, cardio, cross training machines &amp; yoga/pilates/spin
                studio
              </div>
            </div>
          </div>
          <div className="about-single-option">
            <div>
              <img
                src="../assets/images/business_center.png"
                className="info-image"
              />
            </div>
            <div className="info-div">
              <div className="info">24/7 work lounge</div>
              <div className="more-info">
                Private study rooms, coffee bar, printer &amp; computer workstations
              </div>
            </div>
          </div>
          <div className="about-single-option">
            <div>
              <img
                src="../assets/images/climate_controlled.png"
                className="info-image"
              />
            </div>
            <div className="info-div">
              <div className="info">Climate controlled corridors</div>
              <div className="more-info">
                Stay out of the summer heat in the climate-controlled hallways.
              </div>
            </div>
          </div>
          <div className="about-single-option">
            <div>
              <img src="../assets/images/pet_park.png" className="info-image" />
            </div>
            <div className="info-div">
              <div className="info">Pet park</div>
              <div className="more-info">
                An easy way for you and your pet to enjoy some quality time
                outdoors and meet new friends.
              </div>
            </div>
          </div>
          <div className="about-single-option">
            <div>
              <img src="../assets/images/pet_friendly.png" className="info-image" />
            </div>
            <div className="info-div">
              <div className="info">Pet friendly</div>
              <div className="more-info">
                Don't leave your furry friend behind. Bring your pet, we welcome
                it.
              </div>
            </div>
          </div>
          <div className="about-single-option">
            <div>
              <img src="../assets/images/parking_garage.png" className="info-image" />
            </div>
            <div className="info-div">
              <div className="info">Parking garage</div>
              <div className="more-info">
                Enjoy the ease and comfort of parking your fancy new ride in the
                state of the art covered parking garage.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default About;