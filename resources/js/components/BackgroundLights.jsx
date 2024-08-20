import React, { useEffect, useRef } from 'react';

const BackgroundLights = () => {
    
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    let prevTextIndex = -1;
    let lastFrameTime = 0;
    const fps = 30; // Docelowa ilość klatek na sekundę
    const frameDuration = 1000 / fps; // Czas trwania jednej klatki w milisekundach

    class SingeTextCell {
        constructor( x, y, char, index ) {
            this.char = char;
            this.posY = y;
            this.animationSpeed = 2;
            this.transparentText = 0.00;
            this.fontSize = 48;
            this.font = `${ this.fontSize }px Roboto Mono`;
            this.indexPosition = index;
            this.textStatus = "off"; // or in, or out, or done
            this.letterSpacing = 10;
            this.posX = x + this.indexPosition * ( this.fontSize / 2 + this.letterSpacing );

            this.transparentAnimationSpeedIn = 0.1;
            this.transparentAnimationSpeedOut = 0.05;
        }

        getStatus() {
            return this.textStatus;
        }

        getColor( alpha = '1.0', color = null ) {
            let cellColor = color || this.color;
            return 'rgba(' + cellColor + ', ' + alpha + ' )';
        }

        draw() {
            ctx.font = this.font;
            ctx.fillStyle = this.getColor( `${this.transparentText}`, '255, 255, 255' );
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'blue';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillText( this.char, this.posX, this.posY);
            ctx.shadowBlur = 30;
            ctx.fillText( this.char, this.posX, this.posY);
            ctx.shadowBlur = 40;
            ctx.fillText( this.char, this.posX, this.posY);
            ctx.shadowColor = 'white';
            ctx.shadowBlur = 2;
            ctx.fillText( this.char, this.posX, this.posY);
            ctx.shadowBlur = 5;
            ctx.fillText( this.char, this.posX, this.posY);
            ctx.shadowBlur = 10;
            ctx.fillText( this.char, this.posX, this.posY);
            ctx.shadowBlur = 50;
            ctx.fillText( this.char, this.posX, this.posY);
        }

        updateOn( cellPosX ) {
            //console.log( cellPosX, "           ", this.posX );
            if ( cellPosX >= this.posX ) {
                this.textStatus = "in";
            }
        }

        updateIn() {
            this.transparentText += this.transparentAnimationSpeedIn ;
            if( this.transparentText >= 1.0 ) {
                this.textStatus = "out";
            }
            //console.log( this.transparentText );
        }

        updateOut() {
            
            if ( this.transparentText > 0.0 ) {
                this.transparentText -= this.transparentAnimationSpeedOut;
            } else if ( this.transparentText < 0.01 ) {
                this.transparentText = 0.0;
                this.textStatus = "done";
            }
            
        }
    }

    class CellText {
        constructor( x, y, text ) {
            this.x = x;
            this.y = y;
            this.text = text.split('');
            this.currentIndex = 0;
            this.lastIndex = this.text.length - 1;
            this.textArray = [];
            this.generateTextArray();
            this.animationStatus = "in"; // or out, or done
        }

        getStatus() {
            return this.animationStatus;
        }

        generateTextArray() {
            
            this.text.forEach( ( char, index ) => {
                this.textArray.push( new SingeTextCell( this.x, this.y, char, index ) );
            } );
        }

        draw() {
            this.textArray.forEach( ( single ) => {
                single.draw();
            } );
            
        }

        updateIn( cellPosX ) {
            if( this.currentIndex > this.lastIndex ) {
                return;
            }
            for ( let i = 0; i < this.textArray.length; i++ ) {
                if( cellPosX <= this.textArray[ i ].posX || this.textArray[ i ].getStatus() === 'out' ) {
                    continue;
                }
                if( cellPosX >= this.textArray[ i ].posX && this.textArray[ i ].getStatus() === 'off' ) {
                    this.textArray[ i ].updateOn( cellPosX );
                    this.currentIndex > this.lastIndex ? this.currentIndex++ : this.currentIndex;
                }

                // if( cellPosX > this.textArray[ 1 ].posX ) {
                //     debugger;
                // }
                if( this.textArray[ i ].getStatus() === 'in' ) {
                    this.textArray[ i ].updateIn();
                    
                } else {
                    //console.log( 'ERROR ... CellText.updateIn() status: ', this.textArray[ i ].getStatus());
                }
            }
            if ( this.textArray[ this.lastIndex ].getStatus() === 'out' ) {
                this.currentIndex = 0;
                this.animationStatus = "out";
                // if( cellPosX > this.textArray[ 1 ].posX ) {
                //     debugger;
                // }
            }
            
        }

        updateOut( callTransparent ) {
            if( this.textArray[ this.currentIndex ].getStatus() === 'out' && callTransparent <= 0.0 ) {
                this.textArray.forEach( ( char ) => { 
                    char.updateOut();
                    if ( char.getStatus() === 'done' && this.currentIndex !== this.lastIndex ) {
                            this.currentIndex++;
                    } else if ( char.getStatus() === 'done' ) {
                        this.currentIndex = 0;
                        this.animationStatus = "done";
                    } else {
                        //console.log( 'ERROR ... CellText.updateOut()', char.getStatus() );
                    }
                } );
            }
        }

        
    }

    class Cell {
        constructor( x, y, dirX, dirY, size, color, text ) {
            this.x = x;
            this.y = y;
            this.textPosX = ( Math.random() * ( canvas.width - 50 ) ) - 200;
            this.dirX = dirX;
            this.dirY = dirY;
            this.size = size;
            this.color = color;
            this.transparent = 1.0;
            this.shineSizeBottom = ( Math.random() * ( 70 - 5 + 1 ) ) + 50;
            this.shineSizeTop = ( Math.random() * ( -5 + 70 + 1 ) ) - 70;
            this.shineSizeRight = ( Math.random() * ( 70 - 5 + 1 ) ) + 50;
            this.shineSizeLeft = ( Math.random() * ( -5 + 70 + 1 ) ) - 70;
            this.bigShineSize = canvas.width / 7;
            this.bigShineHeight = 40;
            this.cellSpeed = 40;
            this.textCell = new CellText( this.textPosX, this.y, text );
            this.status = "ready" // or lightDone or allDone or textAnimation
        }

        getStatus() {
            return this.status;
        }

        getColor( alpha = '1.0', color = null ) {
            let cellColor = color || this.color;
            return 'rgba(' + cellColor + ', ' + alpha  * this.transparent + ' )';
        }

        draw() { 
            if ( this.size > 0 ) {
                this.drawBigShine();
                this.drawBase();
                this.drawBlur();
                this.drawShines();
            }
            this.textCell.draw();
        }

        drawBigShine() {
            const gradient = ctx.createRadialGradient(this.x, this.y, this.size / 2, this.x, this.y, this.bigShineSize );
            gradient.addColorStop( 0.0, this.getColor( '0.00' ));
            gradient.addColorStop( 0.05, this.getColor( '0.07' ));
            gradient.addColorStop( 1, 'transparent' );

            ctx.beginPath();
            ctx.moveTo( this.x , this.y + ( this.size  ) );
            ctx.lineTo( this.x - this.bigShineSize, this.y + this.bigShineHeight );
            ctx.lineTo( this.x - this.bigShineSize, this.y - this.bigShineHeight );
            ctx.lineTo( this.x, this.y - ( this.size  ));
            ctx.shadowColor = 'rgba(0, 255, 0, 1)'; // Kolor cienia
            ctx.shadowBlur = 2; // Rozmycie cienia
            ctx.closePath();
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.shadowColor = 'rgba(255, 255, 255, 0)'; // Kolor cienia
            ctx.shadowBlur = 0; // Rozmycie cienia

            gradient.addColorStop( 0.1, this.getColor( '0.2', '255, 255, 255' ) );
            gradient.addColorStop( 0.3, this.getColor( '0.01', '255, 255, 255' ) );
            gradient.addColorStop( 1, 'transparent' );
            this.drawShine( gradient, 0, 2, -this.bigShineSize, 0 );

            
        }

        drawShine( gradient, x, y, distX, distY ) {
            ctx.beginPath();
            ctx.moveTo( this.x + distX, this.y + distY);
            ctx.lineTo( this.x + x, this.y + y );
            ctx.lineTo( this.x - x, this.y - y );
            ctx.closePath();
            ctx.fillStyle = gradient;
            ctx.fill();
        }

        drawBlur() {
            const gradient = ctx.createRadialGradient(this.x, this.y, this.size / 2, this.x, this.y, this.size * 60);
            gradient.addColorStop( 0.1, this.getColor( '0.2' ) );
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc( this.x, this.y, this.size * 60, 0, Math.PI * 2, false );
            ctx.fill();
        }

        drawShines() {
            const gradient = ctx.createRadialGradient(this.x, this.y, this.size / 2, this.x, this.y, this.size * 60);
            gradient.addColorStop( 0.1, this.getColor( '0.05' ) );
            gradient.addColorStop( 0.3, this.getColor( '0.01' ) );
            gradient.addColorStop(1, 'transparent');
            this.drawShine( gradient, 0, 2, this.shineSizeRight, 0 ); 
            this.drawShine( gradient, 0, 2, this.shineSizeLeft, 0 ); 
            this.drawShine( gradient, 2, 0, 0, this.shineSizeTop ); 
            this.drawShine( gradient, 2, 0, 0, this.shineSizeBottom ); 
        }

        drawBase() {
            const gradient = ctx.createRadialGradient(this.x, this.y, this.size / 2, this.x, this.y, this.size * 12);
            gradient.addColorStop( 0.0, this.getColor( '0.5', '255, 255, 255' ) );
            gradient.addColorStop( 1, 'transparent' );
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc( this.x, this.y, this.size * 12, 0, Math.PI * 2, false );
            ctx.fill();
        }

        updateCellOnly() {
            this.x += this.cellSpeed;
            if( this.x >= this.textCell.textArray[ this.textCell.lastIndex ].posX && this.transparent > 0.0 ) {
                this.transparent -= 0.03
            }
            if( this.transparent <= 0.0 ) {
                this.status = "lightDone";
            }
        }

        update() {
            this.updateCellOnly();
            this.draw();
            if ( this.textCell.getStatus() === "in" ) {
                this.textCell.updateIn( this.x );
            } else if ( this.textCell.getStatus() === "out" ) {
                this.textCell.updateOut( this.transparent );
            } else if ( this.textCell.getStatus() === "done" ) {
                this.status = "allDone";
            }
        }
    }

    function getRandomText() {
        let textArray = [
            "We are professional",
            "Fast solution",
            "Trust our experts",
            "Implement new technology",
            "Get match solutions",
            "Many happy customers",
        ];
        let randomIndex;
        do {
            randomIndex = Math.floor( Math.random() * ( textArray.length - 1) );
        } while( randomIndex === prevTextIndex )
        prevTextIndex = randomIndex;
        return textArray[ randomIndex ];
    }

    function getRandomColor() {
        let colorArray = [
            '255, 0, 0',
            '0, 255, 0',
            '0, 0, 255',
            '255, 77, 77',
            '255, 255, 100',
            '140, 255, 26',
            '64, 128, 0',
            '102, 204, 255',
            '0, 170, 255',
            '0, 153, 230',
            '255, 153, 204',
            '255, 26, 140',
            '179, 0, 89',
            '255, 102, 102',
            '102, 102, 255',
            '0, 0, 179',
        ];
        return colorArray[ Math.floor( Math.random() * ( colorArray.length - 1) ) ];
    }

    function init() {
        let size = ( Math.random() * 4 ) + 2; // Losuje rozmiar cząsteczki
        let x = -100;//(Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2); // Losuje początkową pozycję X cząsteczki
        let y = ( Math.random() * ( ( innerHeight - size * 2 ) - ( size * 2 + 100 ) ) + size * 2 ); // Losuje początkową pozycję Y cząsteczki
        let directionX = (Math.random() * 5.5) + 0.25; // Losuje kierunek i prędkość w osi X
        let directionY = (Math.random() * 0.5) - 0.25; // Losuje kierunek i prędkość w osi Y
        let color = getRandomColor();
        // getRandomColor();
        particlesArray.push(new Cell(x, y, directionX, directionY, size, color, getRandomText() )); // Dodaje nową cząsteczkę do tablicy
        console.log( "init() w background light ilosc elementow czasteczki w tle", particlesArray.length, particlesArray );
    //   }
    }

    function animate( currentTime ) {
        const deltaTime = currentTime - lastFrameTime;
        if ( deltaTime >= frameDuration ) {
            lastFrameTime = currentTime;
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            particlesArray.forEach( ( cell ) => { 
                cell.update();
                if( cell.getStatus() === "allDone" ) {
                    particlesArray.shift();
                    init();
                    console.log( innerHeight, innerWidth, "-------------------------------------------------------------------------------", particlesArray )
                    
                }
            } );
        }
        
        requestAnimationFrame(animate); // Zapewnia płynne animowanie poprzez wywoływanie animate w sposób ciągły

        
    }

    init(); 
    animate(); 

    // function resetCanvas() {
    //     canvas.width = window.innerWidth;
    //     canvas.height = window.innerHeight;
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     particlesArray = [];
    //     init();
    //     animate(0);
    //   }
    //   resetCanvas();

    window.addEventListener('resize', function () {
      canvas.width = innerWidth; 
      canvas.height = innerHeight; 
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      particlesArray = [];
      init();
    });

  }, []);
  
  return <canvas ref={canvasRef} id="canvas"></canvas>;
};

export default BackgroundLights;
