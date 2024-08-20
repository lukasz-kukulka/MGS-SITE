import React, { useRef, useEffect } from 'react';

const Wave = (props) => {
    const canvasRef = useRef(null);
    let animationId;
  
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
    
        const fontSize = 20; // Zmieniono na 48
        ctx.font = `700 ${fontSize}px Roboto Mono`;
    
        const text = props.children;
        const textMetrics = [...text].map(char => ctx.measureText(char));
        const textWidth = textMetrics.reduce((acc, metric) => acc + metric.width, 0);
    
        // Ustawienie szerokości i wysokości płótna
        canvas.width = textWidth + ( textWidth / 10 );
        canvas.height = fontSize * 3.0;
    
        ctx.font = `700 ${fontSize}px Roboto Mono`;
        ctx.fillStyle = 'rgba(255, 255, 255, 1.0 )';
        const drawText = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();

            let xPos = 0; // Początkowa pozycja x
            let marginFront = textMetrics[ 0 ].width;
            
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const charWidth = textMetrics[i].width;
                const y = canvas.height / 2 + Math.sin((Date.now() / 109 ) + i) * 2;

                // Rysowanie cienia
                // ctx.fillStyle( 'rgba(255, 255, 255, 1.0 )' );
                ctx.shadowColor = 'rgba(0, 255, 255, 0.2 )';
                ctx.shadowBlur = 5;
                // ctx.shadowOffsetX = Math.sin(Date.now() / 100 + i) * 5;
                // ctx.shadowOffsetY = Math.cos(Date.now() / 100 + i) * 5;

                if ( i === 0 ) {
                    xPos += marginFront;
                }
                ctx.fillText(char, xPos, y);
                xPos += charWidth; // Przesunięcie do przodu o szerokość znaku i dodatkowy odstęp
            }

            ctx.restore();
        };
    
        const animate = () => {
            drawText();
            animationId = requestAnimationFrame(animate);
        };
    
        animate();
    
        // Funkcja czyszcząca do zatrzymania animacji po odmontowaniu komponentu
        return () => cancelAnimationFrame(animationId);
        }, [props.children]);
    
        return <canvas ref={canvasRef} />;
  };
  
  export default Wave;



  