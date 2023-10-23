import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faHome } from "@fortawesome/free-solid-svg-icons";
import "./Breadcrumb.css";

const Breadcrumb = ({ currentPath, handleBreadcrumbClick }) => {
  const newCurrentPath = "Home/".concat(currentPath);
  let pathSegments = newCurrentPath.split("/");

  // Handle clicking on "Home" to navigate to the root directory
  const handleClick = (segment) => {
    if (segment === "Home") {
      // If the segment clicked is "Home," navigate to the root directory
      handleBreadcrumbClick(""); // Pass an empty string or another suitable value to represent the root directory
    } else {
      handleBreadcrumbClick(segment);
    }
  };

  return (
    <div className="breadcrumb">
      {pathSegments.map((segment, index) => (
        <span key={index} className="breadcrumb-segment">
          {/* Add a space and > icon after the segment */}
          {index > 0 && <FontAwesomeIcon icon={faArrowRight} />}{" "}
          {/* add home icon */}
          {segment === "Home" ? (
            <FontAwesomeIcon
              icon={faHome}
              // style={{ color: "#696969" }}
              onClick={() => handleClick(segment)}
              className="home-icon"
            />
          ) : (
            <span onClick={() => handleClick(segment)} className="crumb">
              {segment}
            </span>
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;
