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

        this.setBorders();
        this.textSpacing = 5;
        this.textLaneTable = [];
        this.colorUpdate();
        this.imageData = null;
        this.opacity = 1.0;
        this.virtualTextImage = null;
        this.heightWithTextAndImageArray = this.height;
        this.canvasHeightWithTextAndImageArray = this.canvas.height;
        this.virtualTextImageX = 0;
    }

    setTextOpacity( opacity ) {
        this.opacity = opacity;
    }

    setFont() {
        this.fontSize = this.canvas.width / 80;
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

    setMovePosition( limitX, limitY, speed ) {
        this.expandStatus = "begin"; // onPlace, 
        this.startX = limitX;
        this.startY = limitY;
        this.expandSpeed = 30;
        this.moveToCornerSpeedX = ( this.x - limitX ) / speed;
        this.moveToCornerSpeedY = ( this.y - limitY ) / speed;

    }

    setResize( x, y, speed ) {
        this.expandStatus = "begin"; // onPlace, 
        this.expandSizeX = x;
        this.expandSizeY = y;
        this.resizeSpeedX = ( this.width - this.expandSizeX ) / speed;
        this.resizeSpeedY = ( this.height - this.expandSizeY ) / speed;
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

    setBorders( left = this.x + this.borderRadius, 
                right = this.x + this.width - this.borderRadius,
                top = this.y + this.borderRadius,
                bottom = this.y + this.height - this.borderRadius ) {
                    if( left !== null ) {
                        this.textBorderLeft = left;
                    }

                    if( right !== null ) {
                        this.textBorderRight = right;
                    }

                    if( top !== null ) {
                        this.textBorderTop = top;
                    }

                    if( bottom !== null ) {
                        this.textBorderBottom = bottom;
                    }
    }

    getTextArray() {
        return this.textLaneTable;
    }

    copyTextArray( array ) {
        this.textLaneTable = array;
    }

    setTextArray( text, scale = 1.0 ) {
        this.ctx.font = `${ this.fontSize * scale }px ${ this.fontName }`;
        const wordsArray = text.split(/\s+/);
        let index = 0;
        let pictureFullSizeX = 0;
        if ( this.imageData !== null ) {
            pictureFullSizeX = this.imageData[ 0 ].position.br[ 0 ] - this.imageData[ 0 ].position.bl[ 0 ];
        }

        const pictureOneUnitSpace = ( ( this.fontSize * scale ) / 5 ) * 3
        while( index < wordsArray.length ) {
            let oneLaneText = "";
            let oneLaneTextSize = this.ctx.measureText( oneLaneText ).width;
            let nextWord = wordsArray[ index ]; 
            let nextWordSize = this.ctx.measureText( wordsArray[ index ] ).width;
            let textPosY = this.textBorderTop + ( ( this.textSpacing * scale ) * this.textLaneTable.length + ( this.fontSize * scale ) * ( this.textLaneTable.length + 1 ) );
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

            while( ( oneLaneTextSize + nextWordSize < this.textBorderRight - this.textBorderLeft ) && ( index <= wordsArray.length ) ) {
                oneLaneText += nextWord;
                oneLaneTextSize = oneLaneText.length * pictureOneUnitSpace;
                nextWord = " " + wordsArray[ ++index ]; 
                nextWordSize = nextWord.length * pictureOneUnitSpace;
            }

            
            if ( textPosY > this.textBorderBottom ) {
                this.heightWithTextAndImageArray += this.textSpacing + this.fontSize * scale;
                this.canvasHeightWithTextAndImageArray += this.textSpacing + this.fontSize;
                this.ctx.font = `${ this.fontSize * scale }px ${ this.fontName }`;
                this.textBorderBottom = textPosY;
            }

            this.textLaneTable.push( [ this.textBorderLeft, textPosY, oneLaneText ] );
            oneLaneText = "";
        }
        this.heightWithTextAndImageArray = this.textBorderBottom - this.textBorderTop + 2 * this.fontSize * scale + 2 * this.textSpacing;
    }

    setMoveOutSettings( endPos ) {
        this.endPos = endPos;
    }

    addImage( path = null, posX = 0, posY = 0, alignmentVertical = "top", alignmentHorizontal = "left" ) {
        this.img = new Image();
        this.img.src = path;
        this.imageSize = ( this.textBorderRight - this.textBorderLeft ) * 0.5 < 300 ? ( this.textBorderRight - this.textBorderLeft ) : ( this.textBorderRight - this.textBorderLeft ) * 0.3;
        this.setImagesData( this.imageSize, alignmentVertical, alignmentHorizontal );
        
    }

    setImagesData( imageSize, alignmentVertical = "top", alignmentHorizontal = "left"  ) {
        
        const baseX = this.setBaseX( imageSize, alignmentHorizontal );
        const baseY = this.setBaseY( imageSize, alignmentVertical );
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
        console.log("...something was wrong in CanvasTileContent.setBaseY not ready for center nad bottom");
        return 0;
    }

    setVirtualTextScreen() {
        this.virtualTextImage = document.createElement('canvas');
        this.virtualTextImage.width = this.canvas.width;
        this.virtualTextImage.height = this.canvas.height;
        const virtualContext = this.virtualTextImage.getContext('2d');

        this.ctx.save();
        virtualContext.font = `${ this.fontSize }px ${ this.fontName }`;
        virtualContext.fillStyle = `white`;
        virtualContext.beginPath();

        this.textLaneTable.forEach( ( oneLane ) => {
            virtualContext.fillText( oneLane[ 2 ], oneLane[ 0 ], oneLane[ 1 ] );
        } );
        //console.log( "setVirtualTextScreen inf tileContent: ", this.textLaneTable );
        virtualContext.fill();
        virtualContext.restore();
    }

    drawVirtualTextScreen() {
        //console.log( "drawVirtualTextScreen inf tileContent: ", this.textLaneTable );
        if( this.opacity !== 1.0 ) {
            this.ctx.globalAlpha = this.opacity;
            this.ctx.drawImage( this.virtualTextImage, this.virtualTextImageX, 0 );
            this.ctx.globalAlpha = 1.0;
        } else {
            this.ctx.drawImage( this.virtualTextImage, this.virtualTextImageX, 0 );
        }
    }

    drawText() {
        this.ctx.save();
        this.ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;

        this.ctx.beginPath();
        this.ctx.filter = `blur(${this.blur}px)`
        this.textLaneTable.forEach( ( oneLane ) => {
            this.ctx.fillText( oneLane[ 2 ], oneLane[ 0 ], oneLane[ 1 ] );
        } );
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
        this.ctx.save();
        this.drawRoundedSquare( this.textBorderLeft, this.textBorderTop, this.imageSize, this.imageSize, this.borderRadius );
        this.ctx.clip();
        if ( this.img !== null ) {
            this.ctx.drawImage( this.img, this.textBorderLeft, this.textBorderTop, this.imageSize, this.imageSize );
        }
        this.ctx.restore();
    }

    move( speed ) {
        if ( this.endPos > this.x ) {
            this.x += speed;
            if ( this.virtualTextImage !== null ) {
                this.virtualTextImageX += speed;
            }
            if( this.endPos < this.x ) {
                this.x = this.endPos;
            }
            return true;
        } else {
            return false;
        }
    }

    shine( isLast = false ) {
        if ( this.shineValue >= 1.00 && this.shineStatus === 'in' ) {
            this.shineSpeed = -1 * this.baseShine;
            if( isLast === false ) {
                this.expandValue *= -1;
            }
            this.shineStatus = 'out'
        } else if ( this.shineValue <= this.baseShine * 2 && this.shineStatus === 'out' ) {
            this.shineSpeed = this.baseShine;
            this.expandValue *= -1;
            this.shineStatus = 'done';
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
    }

    expand() {
        const speedX = Math.abs( this.moveToCornerSpeedX );
        const speedY = Math.abs( this.moveToCornerSpeedY );
        const reducer = Math.max( speedX, speedY );

        if( this.startX >= this.x - reducer && this.startX <= this.x + reducer ) {
            this.x = this.startX;
        }

        if( this.startY >= this.y - reducer && this.startY <= this.y + reducer ) {
            this.y = this.startY;
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
    }

    resize() {
        const speedX = Math.abs( this.resizeSpeedX );
        const speedY = Math.abs( this.resizeSpeedY );
        //const canvasYLimit = Math.floor(this.canvasHeightWithTextAndImageArray);
        // const canvasYLimit = this.expandSizeY;

        if( this.expandSizeX > this.width ) {
            this.width += speedX;
        }

        if( this.expandSizeX < this.width ) {
            this.width = this.expandSizeX;
        }

        if( this.expandSizeY > this.height ) {
            this.height += speedY;
        }

        if( this.expandSizeY < this.height ) {
            this.height = this.expandSizeY;
        }
        
        // if( canvasYLimit > this.canvas.height ) {
        //     this.canvas.height += speedY;
        // }

        // if( canvasYLimit < this.canvas.height ) {
        //     this.canvas.height = canvasYLimit;
        // }

        if( this.expandSizeX === this.width && this.expandSizeY === this.height ) {
            this.expandStatus = 'onPlace';
            this.canvas.height = this.height + this.startY;
        }
    }

    setOpacity( val ) {
        //CONSOLE.LOG( this.opacity, val );
        if( this.opacity < 1.0 ) {
            this.opacity += val;
        } else {
            this.opacity = 1.0;
        }
        
    }
}