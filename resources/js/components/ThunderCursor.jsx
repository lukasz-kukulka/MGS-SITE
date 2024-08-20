import React, { useRef, useEffect } from 'react';

const ThunderCursor = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error('Canvas not found');
            return;
        }

        canvas.style.position = 'fixed';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get canvas context');
            return;
        }

        // Funkcja rysowania
        function draw( x = 0, y = 0 ) {
            
        }

        function animate() {
            requestAnimationFrame( animate );
        }

        // Listener do wykrywania pozycji kursora
        const handleMouseMove = (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            console.log('Pozycja kursora: ', x, y);
            draw( x, y ); // Rysujemy pozycję kursora przy każdym ruchu
        };

        window.addEventListener('mousemove', handleMouseMove);

        animate();

        // Usunięcie listenera przy demontażu komponentu
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return <canvas ref={canvasRef} />;
};

export default ThunderCursor;
