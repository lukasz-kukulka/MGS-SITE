export class CanvasTileContent {
    constructor( context, canvas, x, y, width, height, radius, animationBorderEnd = 0, animationBorderStart = 0, blur = 0 ) {
    //constructor( context, canvas, tl, tr, bl, br, width, height, radius, animationBorderEnd, animationBorderStart  ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.borderRadius = radius;
        this.ctx = context;
        this.canvas = canvas;
        this.animationBorderStart = animationBorderStart;
        this.animationBorderEnd = animationBorderEnd;
        this.blur = blur;
        this.img = null;
        this.setFont();

        this.textBorderTop = this.y + this.borderRadius;
        this.textBorderLeft = this.x + this.borderRadius;
        this.textBorderRight = this.x + this.width - this.borderRadius;
        this.textBorderBottom = this.y + this.height - this.borderRadius;
        this.textSpacing = 5;
        this.textLaneTable = [];
        this.colorUpdate();
        this.imageData = null;
    }

    setFont() {
        this.fontSize = 25;
        this.fontName = 'Roboto Mono'; // if you change font type change compute const pictureOneUnitSpace in setTextArray() method
        this.ctx.font = `${ this.fontSize }px ${ this.fontName }`;
    }

    setAnimationPositions( beginPos, endPos ) {
        this.setShineData();
        this.beginPos = beginPos;
        this.endPos = endPos;
        this.x = this.beginPos;
    }

    setShineData() {
        // this.textIndex = 0;
        this.shineValue = 0.00;
        this.baseShine = 0.1;
        this.shineSpeed = this.baseShine;
        this.expandValue = 3
        this.shineStatus = 'in' // out, done
    }

    setMovePosition( limitX, limitY ) {
        this.expandStatus = "begin"; // onPlace, 
        this.startX = limitX;
        this.startY = limitY;
        this.expandSpeed = 30;
        this.moveToCornerSpeedX = ( this.x - limitX ) / this.expandSpeed;
        this.moveToCornerSpeedY = ( this.y - limitY ) / this.expandSpeed;

    }

    setResize( x, y ) {
        const resizeSpeed = 10;
        this.expandStatus = "begin"; // onPlace, 
        this.expandSizeX = x;
        this.expandSizeY = y;
        this.resizeSpeedX = ( this.width - this.expandSizeX ) / resizeSpeed;
        this.resizeSpeedY = ( this.height - this.expandSizeY ) / resizeSpeed;
        //debugger
    }

    // SZABLON DO POZYCJI OBRAZOW PRZY GENEROWANIOU TEXTU 
    // imageData = [
    //     {
    //         "alignment": {
    //             "vertical": "top center bottom", 
    //             "horizontal": "left center right", 
    //         },
    //         "position": {
    //             "tl": [ x, y ],
    //             "tr": [ x, y ],
    //             "bl": [ x, y ],
    //             "br": [ x, y ],
    //         }
    //     },
    //     {
    //         "alignment": {
    //             "vertical": "top center bottom", 
    //             "horizontal": "left center right", 
    //         },
    //         "position": {
    //             "tl": [ x, y ],
    //             "tr": [ x, y ],
    //             "bl": [ x, y ],
    //             "br": [ x, y ],
    //         }
    //     }
    // ];


    setTextArray( text, scale = 1.0 ) {
        this.ctx.font = `${ this.fontSize * scale }px ${ this.fontName }`;
        const wordsArray = text.split(/\s+/);
        console.log( "setTetxtArray : ", "|", this.imageData, "|", wordsArray.length );
        
        let index = 0;
        let pictureFullSizeX = 0;
        if ( this.imageData !== null ) {
            pictureFullSizeX = this.imageData[ 0 ].position.br[ 0 ] - this.imageData[ 0 ].position.bl[ 0 ];
        }

        const pictureOneUnitSpace = ( ( this.fontSize * scale ) / 5 ) * 3
        while( index < wordsArray.length ) {
            console.log( "test in setTextArray( text ) ");
            let oneLaneText = "";
            let oneLaneTextSize = this.ctx.measureText( oneLaneText ).width;
            let nextWord = wordsArray[ index ]; 
            //let nextWordSize = this.ctx.measureText( wordsArray[ index ] ).width;
            let nextWordSize = this.ctx.measureText( wordsArray[ index ] ).width;
            let textPosY = this.textBorderTop + ( ( this.textSpacing * scale ) * this.textLaneTable.length + ( this.fontSize * scale ) * ( this.textLaneTable.length + 1 ) );
            //const pictureOneUnitSpace = ( this.fontSize / 5 ) * 3;
            if ( this.imageData !== null ) {
                if ( textPosY - ( this.fontSize * scale ) > this.imageData[ 0 ].position.bl[ 1 ] ) {
                    pictureFullSizeX = 0;
                } else {
                    for( let i = 0; i <= pictureFullSizeX / pictureOneUnitSpace + 1; i++ ) {
                        oneLaneText+= ' ';
                    }
                }
                oneLaneTextSize += pictureFullSizeX;
            }
            
            // console.log( 'oneLaneTextSize += pictureFullSizeX       ', oneLaneTextSize, pictureFullSizeX )
            // debugger;
            // const isSpaceInLane = ( oneLaneTextSize + nextWordSize < this.textBorderRight ) && ( index <= wordsArray.length );
            //debugger
            while( ( oneLaneTextSize + nextWordSize < this.textBorderRight - this.textBorderLeft ) && ( index <= wordsArray.length ) ) {
                oneLaneText += nextWord;
                oneLaneTextSize = oneLaneText.length * pictureOneUnitSpace;
                nextWord = " " + wordsArray[ ++index ]; 
                nextWordSize = nextWord.length * pictureOneUnitSpace;
            }
             //debugger;
            
            if ( textPosY > this.textBorderBottom ) {
                this.height += this.textSpacing + this.fontSize * scale;
                this.canvas.height += this.textSpacing + this.fontSize;
                this.ctx.font = `${ this.fontSize * scale }px ${ this.fontName }`;
            }
            //debugger;
            this.textLaneTable.push( [ this.textBorderLeft, textPosY, oneLaneText ] );
            oneLaneText = "";
        }
        //console.log( this.textLaneTable );
    }

    addImage( path = null, posX = 0, posY = 0, alignmentVertical = "top", alignmentHorizontal = "left" ) {
        console.log( "addImage : ", this.imageData );
        this.img = new Image();
        this.img.src = path;
        console.log( this.ctx, this.canvas );
        this.imageSize = ( this.textBorderRight - this.textBorderLeft ) * 0.5 < 300 ? ( this.textBorderRight - this.textBorderLeft ) : ( this.textBorderRight - this.textBorderLeft ) * 0.3;
        this.setImagesData( this.imageSize, alignmentVertical, alignmentHorizontal );
        
    }

    setImagesData( imageSize, alignmentVertical = "top", alignmentHorizontal = "left"  ) {
        
        const baseX = this.setBaseX( imageSize, alignmentHorizontal );
        const baseY = this.setBaseY( imageSize, alignmentVertical );
        console.log( "baseX", baseX );
        this.imageData = [
            {
                "alignment": {
                    "vertical": alignmentVertical, 
                    "horizontal": alignmentHorizontal, 
                },
                "position": {
                    "tl": [ baseX, baseY ],
                    "tr": [ baseX + imageSize, baseY ],
                    "bl": [ baseX, baseY + imageSize ],
                    "br": [ baseX + imageSize, baseY + imageSize ],
                }
            }
        ];
        console.log( "setImagesData : ", this.imageData );
    }

    setBaseX( imageSize, alignmentHorizontal = "left" ) {
        if( alignmentHorizontal === "left" ) {
            return this.textBorderLeft;
        } else if ( alignmentHorizontal === "center" ) {
            return this.textBorderLeft + ( ( this.width / 2 ) - ( imageSize / 2 ) );
        } else if ( alignmentHorizontal === "right" ) {
            return this.textBorderRight - imageSize;
        }
        console.log("...something was wrong in CanvasTileContent.setBaseX");
        return 0;
    }

    setBaseY( imageSize, alignmentVertical = "top") {
        if( alignmentVertical === "top" ) {
            return this.textBorderTop;
        } 
        // else if ( alignmentVertical === "center" ) {
        //     return this.textBorderLeft + ( ( this.width / 2 ) - ( imageSize / 2 ) );
        // } else if ( alignmentVertical === "bottom" ) {
        //     return this.textBorderRight - imageSize;
        // }
        console.log("...something was wrong in CanvasTileContent.setBaseY not ready for center nad bottom");
        return 0;
    }

    drawText() {
        this.ctx.save();
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.filter = `blur(${this.blur}px)`
        this.textLaneTable.forEach( ( oneLane ) => {
            this.ctx.fillText( oneLane[ 2 ], oneLane[ 0 ], oneLane[ 1 ] );
        } );
        //debugger
        this.ctx.fill();
        this.ctx.restore();
    }

    colorUpdate( backgroundColor = "rgba( 50, 120, 255, 0.1 )", borderColor = "rgba( 0, 0, 70, 0.7 )" ) {
        this.backgroundColor = backgroundColor;
        this.borderColor = borderColor; 
    }

    drawRoundedSquare( x = this.x, y = this.y, width = this.width, height = this.height, borderRadius = this.borderRadius ) {
        this.ctx.beginPath();
        this.ctx.moveTo( x + borderRadius, y );
        this.ctx.lineTo( x + width - borderRadius, y );
        this.ctx.quadraticCurveTo( x + width, y, x + width, y + borderRadius);
        this.ctx.lineTo( x + width, y + height - borderRadius);
        this.ctx.quadraticCurveTo( x + width, y + height, x + width - borderRadius, y + height );
        this.ctx.lineTo( x + borderRadius, y + height );
        this.ctx.quadraticCurveTo( x, y + height, x, y + height - borderRadius );
        this.ctx.lineTo( x, y + borderRadius );
        this.ctx.quadraticCurveTo( x, y, x + borderRadius, y );
        this.ctx.closePath();
    }

    drawSquare() {
        this.drawRoundedSquare();
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.strokeStyle = this.borderColor;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.fill();
    }

    draw() {
        this.drawSquare();
        this.drawText();
        this.ctx.save();
        this.drawRoundedSquare( this.textBorderLeft, this.textBorderTop, this.imageSize, this.imageSize, this.borderRadius );
        this.ctx.clip();
        if ( this.img !== null ) {
            this.ctx.drawImage( this.img, this.textBorderLeft, this.textBorderTop, this.imageSize, this.imageSize );
        }
        this.ctx.restore();
    }

    update( speed ) {
        //console.log( this.x, this.animationBorderStart, this.animationBorderEnd );
        // if( this.x > this.animationBorderEnd ) {
        //     console.log( this.x, this.animationBorderEnd );
        //     this.x = this.animationBorderStart;
        // } else { 
        //     this.x += speed * 0.3;
        // }
    }

    moveIn( speed ) {
        if ( this.endPos > this.x ) {
            this.x += speed;
            return true;
        } else {
            return false;
        }
    }

    shine( isLast = false ) {
        //console.log( this.shineSpeed, this.baseShine, this.shineValue,  this.shineStatus );
        // this.textIndex++;
        if ( this.shineValue >= 1.00 && this.shineStatus === 'in' ) {
            this.shineSpeed = -1 * this.baseShine;
            if( isLast === false ) {
                this.expandValue *= -1;
            }
            this.shineStatus = 'out'
            // console.log( 'TEST --------------------------------- ', this.textIndex );
            // this.textIndex = 0;
        } else if ( this.shineValue <= this.baseShine * 2 && this.shineStatus === 'out' ) {
            this.shineSpeed = this.baseShine;
            this.expandValue *= -1;
            this.shineStatus = 'done';
            
            // console.log( 'TEST2 --------------------------------- ', this.textIndex );
            // this.textIndex = 0;
            //console.log( this.shineSpeed, this.baseShine, this.shineValue,  this.shineStatus );
        }
        if ( this.shineStatus !== 'done' ) {
            this.shineValue += this.shineSpeed;
            this.height += this.expandValue;
            this.width += this.expandValue;
            this.x -= this.expandValue / 2;
            this.y -= this.expandValue / 2;
            this.ctx.save();
            this.ctx.beginPath();
            this.drawRoundedSquare();
            this.ctx.strokeStyle = `rgba( 255, 255, 255, ${ this.shineValue } )`;
            this.ctx.fillStyle = `rgba( 255, 255, 255, ${ this.shineValue } )`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.closePath();
            this.ctx.restore();
        }
        //console.log( this.shineValue, this.shineStatus );
    }

    expand() {
        const speedX = Math.abs( this.moveToCornerSpeedX );
        const speedY = Math.abs( this.moveToCornerSpeedY );
        const reducer = Math.max( speedX, speedY );

        if( this.startX >= this.x - reducer && this.startX <= this.x + reducer ) {
            this.x = this.startX;
            //debugger
        }

        if( this.startY >= this.y - reducer && this.startY <= this.y + reducer ) {
            this.y = this.startY;
            //debugger
        }

        if( this.startX < this.x ) {
            this.x -= speedX;
        }

        if( this.startX > this.x ) {
            this.x += speedX;
        }

        if( this.startY < this.y ) {
            this.y -= speedY;
        }

        if( this.startY > this.y ) {
            this.y += speedY;
        }

        if( this.startX === this.x && this.startY === this.y ) {
            this.expandStatus = 'onPlace';
        }
        // console.log( speedX, speedY )
        console.log( 'Y = ', this.startX, '===', this.x, this.startY, '===', this.y );

        // if ( this.startX === this.x ) {
        //     console.log( 'X = ', this.startX, '===', this.x, this.startY, '===', this.y );
        // }

        // if ( this.startY === this.y ) {
        //     console.log( 'Y = ', this.startX, '===', this.x, this.startY, '===', this.y );
        // }
    }

    resize() {
        const speedX = Math.abs( this.resizeSpeedX );
        const speedY = Math.abs( this.resizeSpeedY );
        // const reducer = 1.0;

        // if( this.startX >= this.x - reducer && this.startX <= this.x + reducer ) {
        //     this.x = this.startX;
        //     //debugger
        // }

        // if( this.startY >= this.y - reducer && this.startY <= this.y + reducer ) {
        //     this.y = this.startY;
        //     //debugger
        // }

        if( this.expandSizeX >= this.width ) {
            this.width += speedX;
        }

        // if( this.startX > this.x ) {
        //     this.x += speedX;
        // }

        if( this.expandSizeY >= this.height ) {
            this.height += speedY;
        }
        //console.log( speedX, speedY,  )
        // if( this.startY > this.y ) {
        //     this.y += speedY;
        // }

        if( this.expandSizeX <= this.width && this.expandSizeY <= this.height ) {
            //debugger
            this.height = speedY;
            this.width = speedX;
            this.expandStatus = 'onPlace';
        }
    }

    moveOut() {
        // if ( this.x <= this.canvas.width - 200 ) {
        //     const speed = 15.0
        //     this.x += speed;
        //     this.textBorderLeft += speed;
        //     this.textBorderRight += speed;
        //     this.textLaneTable.forEach( ( lane ) => {
        //         lane[ 0 ] += speed;
        //     } );
        // }
        
        //this.y += 1.0;
    }
}