import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
//view-container-out

const ViewOut = () => {
    const location = useLocation();

    useEffect(() => {
      const contentContainers = document.getElementsByClassName('view-container-out');
  
      if (contentContainers.length > 0) {
        const contentContainer = contentContainers[0];
  
        const paragraph = contentContainer.querySelector('p');
  
        if (paragraph) {
          paragraph.style.color = 'red';
        }
      }
    }, [location.pathname]); // Dodanie location.pathname jako zależności
  
    return null;
  };

export default ViewOut;


