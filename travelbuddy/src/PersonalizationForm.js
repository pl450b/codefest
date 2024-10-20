import React, { useState } from "react";
import './PersonalizationForm.css'; // You can add your styles in a separate CSS file

const TravelForm = () => {
  // State to track selected interests for each category
  const [selectedInterests, setSelectedInterests] = useState({
    travelFrequency: "",
    travelDestinations: [],
    travelPersonality: "",
    travelHabits: [],
    documentingTravel: ""
  });

  // Function to handle toggling selection for multiple-choice options
  const toggleSelection = (category, interest) => {
    setSelectedInterests((prev) => {
      if (category === "travelFrequency" || category === "travelPersonality" || category === "documentingTravel") {
        // Single choice categories
        return { ...prev, [category]: prev[category] === interest ? "" : interest };
      } else if (category === "travelDestinations" || category === "travelHabits") {
        // Multiple choice categories
        return {
          ...prev,
          [category]: prev[category].includes(interest)
            ? prev[category].filter((item) => item !== interest)
            : [...prev[category], interest]
        };
      }
      return prev;
    });
  };

  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault(); // Prevent page reload on form submission
    console.log("User's Selected Travel Preferences:", selectedInterests);

    const ipAddress = '172.31.104.7';
    const port = '5000';
    const url = `http://${ipAddress}:${port}/preferences`;  
    const response = await fetch(`${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionToken: localStorage.getItem('sessionToken'),selectedInterests }),
    });

    if(response.ok) {
      console.log("Data sent sucessfully!")
    } else {
      console.log("Data transfer failed")
    }

    window.location.href = "/dashboard"
    // You can replace this with an API call or another action.
  };

  const handleBack = () => {
    window.history.back(); // Navigate back to the previous page
  };

  return (
      <div class="personalization">

        {/* X Button */}
        <button type="button" className="close-button" onClick={handleBack}>
          &times;
        </button>

        <form className="form-container" onSubmit={handleSubmit}>
          <h2>Tell us about your travel style:</h2>

          {/* Travel Frequency */}
          <Category title="How often do you travel?">
              {["Rarely", "Occasionally", "Frequently", "Always on the go"].map((option) => (
              <Interest
                  key={option}
                  isSelected={selectedInterests.travelFrequency === option}
                  onClick={() => toggleSelection("travelFrequency", option)}
              >
                  {option}
              </Interest>
              ))}
          </Category>

          {/* Preferred Travel Destinations */}
          <Category title="What type of destinations do you prefer?">
              {["Cities", "Beaches", "Mountains", "Cultural sites", "Off-the-beaten-path"].map((option) => (
              <Interest
                  key={option}
                  isSelected={selectedInterests.travelDestinations.includes(option)}
                  onClick={() => toggleSelection("travelDestinations", option)}
              >
                  {option}
              </Interest>
              ))}
          </Category>

          {/* Travel Personality */}
          <Category title="What type of traveler are you?">
              {["Detailed planner", "Somewhat organized", "Totally spontaneous"].map((option) => (
              <Interest
                  key={option}
                  isSelected={selectedInterests.travelPersonality === option}
                  onClick={() => toggleSelection("travelPersonality", option)}
              >
                  {option}
              </Interest>
              ))}
          </Category>

          {/* Travel Habits */}
          <Category title="How do you prefer to spend your time when traveling?">
              {["Sightseeing", "Relaxing by the pool", "Outdoor activities", "Learning about history/culture"].map((option) => (
              <Interest
                  key={option}
                  isSelected={selectedInterests.travelHabits.includes(option)}
                  onClick={() => toggleSelection("travelHabits", option)}
              >
                  {option}
              </Interest>
              ))}
          </Category>

          {/* Documenting Travel */}
          <Category title="How do you document your travels?">
              {["Photos", "Social media posts", "Journaling", "I prefer to stay in the moment"].map((option) => (
              <Interest
                  key={option}
                  isSelected={selectedInterests.documentingTravel === option}
                  onClick={() => toggleSelection("documentingTravel", option)}
              >
                  {option}
              </Interest>
              ))}
          </Category>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
              Submit
          </button>
        </form>
      </div>  
  );
};

// Component for each category
const Category = ({ title, children }) => (
  <div className="category">
    <h3>{title}</h3>
    <div className="interests">{children}</div>
  </div>
);

// Component for each interest/option
const Interest = ({ children, isSelected, onClick }) => (
  <div className={`interest ${isSelected ? "selected" : ""}`} onClick={onClick}>
    {children}
  </div>
);

export default TravelForm;
