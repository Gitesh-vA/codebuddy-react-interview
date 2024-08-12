import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const [formData, setFormData] = useState({
    email: "",
    pwd: "",
    fname: "",
    lname: "",
    address: "",
    countrycode: "+91",
    phonenumber: "",
    acceptTerms: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [visitedSteps, setVisitedSteps] = useState([1]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const re =
      /^(?=.*[a-z]{2,})(?=.*[A-Z]{2,})(?=.*\d{2,})(?=.*[@$!%*?&]{2,})[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(String(password));
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.email || !validateEmail(formData.email)) {
        isValid = false;
        tempErrors["email"] = "Please enter a valid email address.";
      }

      if (!formData.pwd || !validatePassword(formData.pwd)) {
        isValid = false;
        tempErrors["pwd"] =
          "Password must contain at least 2 uppercase letters, 2 lowercase letters, 2 numbers, and 2 special characters.";
      }
    }

    if (currentStep === 2) {
      if (!formData.fname || !/^[A-Za-z]{2,50}$/.test(formData.fname)) {
        isValid = false;
        tempErrors["fname"] =
          "First name must contain only alphabets, with a minimum of 2 characters and a maximum of 50.";
      }

      if (formData.lname && !/^[A-Za-z]+$/.test(formData.lname)) {
        isValid = false;
        tempErrors["lname"] = "Last name must contain only alphabets.";
      }

      if (!formData.address || formData.address.length < 10) {
        isValid = false;
        tempErrors["address"] = "Address must be at least 10 characters long.";
      }
    }

    if (currentStep === 3) {
      if (!["+91", "+1"].includes(formData.countrycode)) {
        isValid = false;
        tempErrors["countrycode"] = "Please select a valid country code (India or America).";
      }

      if (!formData.phonenumber || !/^\d{10}$/.test(formData.phonenumber)) {
        isValid = false;
        tempErrors["phonenumber"] = "Phone number must be a 10-digit number.";
      }

      if (!formData.acceptTerms) {
        isValid = false;
        tempErrors["acceptTerms"] = "You must accept the terms and conditions.";
      }
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateForm()) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setVisitedSteps([...visitedSteps, nextStep]);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleTabClick = (step) => {
    if (visitedSteps.includes(step)) {
      setCurrentStep(step);
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      if (currentStep === 3) {
        // Submit form data via HTTP POST
        // eslint-disable-next-line no-unused-vars
        const { acceptTerms, ...dataToSubmit } = formData;

        fetch("https://codebuddy.review/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to submit form data.");
            }
            return response.json();
          })
          .then((data) => {
            alert("Form data submitted successfully!");
            console.log(data);
            // Navigate to the /posts route
            navigate("/posts");
          })
          .catch((error) => {
            alert(error.message);
            console.error(error);
          });
      } else {
        alert("Form data saved successfully!");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="container-fluid" id="grad1">
      <div className="row justify-content-center mt-0">
        <div className="col-11 col-sm-9 col-md-7 col-lg-6 mb-2 mt-3 p-0 text-center">
          <div className="card mb-3 mt-3 px-0 pb-0 pt-4">
            <h2>
              <strong>SET 1 Task : React Multi-Step Form</strong>
            </h2>
            <p>Fill all form fields to go to the next step</p>
            <div className="row">
              <div className="col-md-12 mx-0">
                <form id="msform">
                  <ul id="progressbar">
                    <li
                      className={currentStep >= 1 ? "active" : ""}
                      id="account"
                      onClick={() => handleTabClick(1)}
                    >
                      <strong>Mail</strong>
                    </li>
                    <li
                      className={currentStep >= 2 ? "active" : ""}
                      id="personal"
                      onClick={() => handleTabClick(2)}
                    >
                      <strong>Personal</strong>
                    </li>
                    <li
                      className={currentStep >= 3 ? "active" : ""}
                      id="payment"
                      onClick={() => handleTabClick(3)}
                    >
                      <strong>Location</strong>
                    </li>
                  </ul>

                  {currentStep === 1 && (
                    <fieldset>
                      <div className="form-card">
                        <h2 className="fs-title">Mail Details</h2>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Id"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        {errors.email && <span className="error">{errors.email}</span>}
                        <input
                          type="password"
                          name="pwd"
                          placeholder="Password"
                          value={formData.pwd}
                          onChange={handleInputChange}
                        />
                        {errors.pwd && <span className="error">{errors.pwd}</span>}
                      </div>
                      <input
                        type="button"
                        name="Back"
                        className="previous action-button-previous"
                        value="Back"
                        disabled
                      />
                      <input
                        type="button"
                        name="Save"
                        className="next action-button"
                        value="Save"
                        onClick={handleSave}
                      />
                      <input
                        type="button"
                        name="Save and Next"
                        className="next action-button custom-btn-width"
                        value="Save and Next"
                        onClick={handleNext}
                      />
                    </fieldset>
                  )}

                  {currentStep === 2 && (
                    <fieldset>
                      <div className="form-card">
                        <h2 className="fs-title">Personal Details</h2>
                        <input
                          type="text"
                          name="fname"
                          placeholder="First Name"
                          value={formData.fname}
                          onChange={handleInputChange}
                        />
                        {errors.fname && <span className="error">{errors.fname}</span>}
                        <input
                          type="text"
                          name="lname"
                          placeholder="Last Name"
                          value={formData.lname}
                          onChange={handleInputChange}
                        />
                        {errors.lname && <span className="error">{errors.lname}</span>}
                        <input
                          type="text"
                          name="address"
                          placeholder="Address"
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                        {errors.address && <span className="error">{errors.address}</span>}
                      </div>
                      <input
                        type="button"
                        name="previous"
                        className="previous action-button-previous"
                        value="Previous"
                        onClick={handlePrevious}
                      />
                      <input
                        type="button"
                        name="Save"
                        className="next action-button"
                        value="Save"
                        onClick={handleSave}
                      />
                      <input
                        type="button"
                        name="next"
                        className="next action-button"
                        value="Next Step"
                        onClick={handleNext}
                      />
                    </fieldset>
                  )}

                  {currentStep === 3 && (
                    <fieldset>
                      <div className="form-card">
                        <h2 className="fs-title">Location Details</h2>
                        <select
                          name="countrycode"
                          value={formData.countrycode}
                          onChange={handleInputChange}
                        >
                          <option value="+91">India (+91)</option>
                          <option value="+1">America (+1)</option>
                        </select>
                        {errors.countrycode && <span className="error">{errors.countrycode}</span>}
                        <input
                          type="text"
                          name="phonenumber"
                          placeholder="Phone Number"
                          value={formData.phonenumber}
                          onChange={handleInputChange}
                        />
                        {errors.phonenumber && <span className="error">{errors.phonenumber}</span>}
                        <div className="custom-flex">
                          <input
                            type="checkbox"
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onChange={handleInputChange}
                            className="custom-checkbox-width"
                          />{" "}
                          <span className="terms-margin">Accept Terms and Conditions</span>
                        </div>
                        {errors.acceptTerms && <span className="error">{errors.acceptTerms}</span>}
                      </div>
                      <input
                        type="button"
                        name="previous"
                        className="previous action-button-previous"
                        value="Previous"
                        onClick={handlePrevious}
                      />
                      <input
                        type="button"
                        name="Save"
                        className="next action-button"
                        value="Save"
                        onClick={handleSave}
                      />
                      <input
                        type="button"
                        name="Save and Next"
                        className="next action-button custom-btn-width"
                        value="Submit"
                        onClick={handleSave}
                      />
                    </fieldset>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
