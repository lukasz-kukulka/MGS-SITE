import React, { useEffect, useRef } from 'react';
import CanvasMainContent from './CanvasMainContent';

const BackgroundContent = () => {
    const navElements = document.querySelectorAll('.nav-menu-link');
    const canvasRef = useRef(null);
    let isInDocument = true;
    let resized = false;
    let animationId;

    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      let background = new CanvasMainContent( context, canvas );

      navElements.forEach( element => {
        element.addEventListener( 'click', function() {
          //debugger
          background.setDefaultSettings();
          background.newContentIn( element.id );

        } )
      } );
      
      let prevDate = new Date();
      function animate() {
          const now = new Date();
          if( ( background.currentState !== 'static' && background.currentState !== 'staticContent' ) && prevDate.getTime() + 100 >= now.getTime() ) {
              background.update();
              background.draw();

          }
          prevDate = now;
          animationId = requestAnimationFrame(animate);
      }
      
      animationId = requestAnimationFrame(animate);

      document.addEventListener('mouseleave', function() {
        isInDocument = false;
        //console.log('Kursor opuścił okno');
        
      });

      document.addEventListener('mouseover', function() {
        isInDocument = true;
        if( resized === true ) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          background.setDefault(context, canvas);
          animationId = requestAnimationFrame(animate);
          resized = false;
        }
        //console.log('Kursor pojawil sie w oknie');
      });



      window.addEventListener('resize', function () {
          cancelAnimationFrame(animationId);
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          if ( isInDocument === false ) {
            resized = true;
          } else {
            resized = false;
          }
          
      } );

    }, []);
  return (
    <div className="App">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default BackgroundContent;

