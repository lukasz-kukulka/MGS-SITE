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
          background.newContentIn( element.id );
        } )
      } );
      
      // console.log( "nav element in main: ", navElements );
      let prevDate = new Date();
      function animate() {
          const now = new Date();
          if( background.currentState !== 'static' && prevDate.getTime() + 40 >= now.getTime() ) {
              background.update();
              background.moveOut();
              background.draw();
          }
          //console.log(navElements.length);
          prevDate = now;
          animationId = requestAnimationFrame(animate);
      }
      
      // function startAnimation() {
      //   animate();
      //   setTimeout(startAnimation, 1000 / 10); // 1000 ms / 30 fps = 33.33 ms per frame
      //   //console.log(document.getElementsByTagName('*').length);
      // }
      
      animationId = requestAnimationFrame(animate);

      document.addEventListener('mouseleave', function() {
        isInDocument = false;
        console.log('Kursor opuścił okno');
        
      });

      document.addEventListener('mouseover', function() {
        isInDocument = true;
        if( resized === true ) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          background.setDefault(context, canvas);
          // background.draw();
          animationId = requestAnimationFrame(animate);
          resized = false;
        }
        console.log('Kursor pojawil sie w oknie');
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


// import React, { useEffect, useRef } from 'react';
// import CanvasMainContent from './CanvasMainContent';

// const BackgroundContent = () => {
//     const canvasRef = useRef(null);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         canvas.width = window.innerWidth;
//         canvas.height = window.innerHeight;
//         let background = new CanvasMainContent(context, canvas);

//         const navElements = document.querySelectorAll('.nav-menu-link');
//         navElements.forEach(element => {
//             element.addEventListener('click', function() {
//                 background.newContentIn(element.id);
//                 triggerExplosion(context, canvas); // Dodaj wywołanie animacji wybuchu
//             });
//         });

//         // Animacja wybuchu
//         const particleSize = 6; // Większe cząsteczki dla mniejszej liczby cząsteczek
//         let particles = [];

//         function createParticles(imageData) {
//             particles = [];
//             const data = imageData.data;
//             for (let y = 0; y < canvas.height; y += particleSize) {
//                 for (let x = 0; x < canvas.width; x += particleSize) {
//                     const red = data[((y * canvas.width + x) * 4)];
//                     const green = data[((y * canvas.width + x) * 4) + 1];
//                     const blue = data[((y * canvas.width + x) * 4) + 2];
//                     const alpha = data[((y * canvas.width + x) * 4) + 3];

//                     // Dodaj tylko widoczne cząsteczki
//                     if (alpha > 0) {
//                         particles.push({
//                             x: x,
//                             y: y,
//                             color: `rgba(${red},${green},${blue},${alpha / 255})`,
//                             velocityX: (Math.random() - 0.5) * 8,
//                             velocityY: (Math.random() - 0.5) * 8
//                         });
//                     }
//                 }
//             }
//         }

//         function drawParticles() {
//             context.clearRect(0, 0, canvas.width, canvas.height);
//             for (let particle of particles) {
//                 context.fillStyle = particle.color;
//                 context.fillRect(particle.x, particle.y, particleSize, particleSize);
//             }
//         }

//         function updateParticles() {
//             for (let particle of particles) {
//                 particle.x += particle.velocityX;
//                 particle.y += particle.velocityY;
//                 particle.velocityY += 0.05; // Zmniejszona grawitacja
//             }
//             // Usuń cząsteczki poza ekranem dla optymalizacji
//             particles = particles.filter(p => p.x >= 0 && p.x < canvas.width && p.y >= 0 && p.y < canvas.height);
//         }

//         function animateExplosion() {
//             updateParticles();
//             drawParticles();
//             if (particles.length > 0) {
//                 requestAnimationFrame(animateExplosion);
//             }
//         }

//         function triggerExplosion(ctx, cnv) {
//             const imageData = ctx.getImageData(0, 0, cnv.width, cnv.height);
//             createParticles(imageData);
//             animateExplosion();
//         }

//         function animate() {
//             background.update(0.1);
//             background.moveOut();
//             background.draw();
//             requestAnimationFrame(animate);
//         }

//         animate();

//         window.addEventListener('resize', function() {
//             canvas.width = window.innerWidth;
//             canvas.height = window.innerHeight;
//             context.clearRect(0, 0, canvas.width, canvas.height);
//             background.setDefault(context, canvas);
//             background.draw();
//         });
//     }, []);

//     return (
//         <div className="App">
//             <canvas ref={canvasRef}></canvas>
//         </div>
//     );
// };

// export default BackgroundContent;
