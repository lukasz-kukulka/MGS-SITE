import { CanvasTileContent } from "./CanvasTileContent";

export default class CanvasMainContent {
    constructor( context, canvas ) {
        this.setDefault( context, canvas );
    }

    setDefault( context, canvas ) {
        this.canvas = canvas;
        this.context = context;
        this.setDefaultSettings();

        this.currentPage = "home"; //home, about, offer, partners, contact
        this.nextPage = "home"; //home, about, offer, partners, contact
        this.contentSpeedOut = 0;
        
        this.homeButton = document.querySelector( '#home-button' );
        this.homeButton.style.position = 'fixed';
        this.homeButton.addEventListener('click', () => {
            this.newContentIn('offer-nav');
        });
        this.drawHomePage();
        this.backgroundTileExtracted = null;

        this.speedIn = 50;
        this.speedOut = 25;
        this.resizeSpeed = 20;
        this.speedBackgroundPos = 30;
        this.opacitySpeed = 0.001;
    }

    setFooter() {
        this.footer = document.querySelector( '#myFooter' );
        this.footerPosY = this.canvas.height;
        this.footerPosX = this.canvas.width / 2 - this.footer.getBoundingClientRect().width / 2;
        this.footerSize = this.footer.getBoundingClientRect().height;
        this.footer.style.position = 'absolute';
        this.footer.style.left = this.footerPosX + 'px';
        this.footer.style.top = this.footerPosY  + 'px';
        this.footer.style.border = '1px solid red';
        this.canvas.height += this.footerSize;
    }

    setDefaultSettings() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.setFooter();
        this.squareArray = [];
        this.laneSpeedArray = [];

        this.startDrawX = 0;
        this.startDrawY = 200;

        this.contentX = ( this.canvas.width / 3 * 2 ) - ( this.canvas.width / 2 );
        this.contentY = document.getElementById( 'full_nav_menu' ).offsetHeight + 20;
        this.contentWidth = this.canvas.width / 3 * 2;
        this.contentHeight = this.canvas.height / 5 * 4;

        this.squareSizeX = this.canvas.width / 8;
        this.squareSizeY = this.squareSizeX ;
        this.squareSpaceX = this.squareSizeX / 8;
        this.squareSpaceY = this.squareSizeY / 8;
        this.borderRadius = 20;
        this.borderAnimationX = this.canvas.width - ( this.squareSizeX + this.squareSpaceX );
        this.backgroundTilesStartX = null;
        this.backgroundTilesStartY = null;

        this.currentState = "static"; // static, out, in, shine, expandBegin, expandBackground, expandEnd, contentEntry, staticContent
        this.contentTilesArray = [];
  
        this.contentObjectsArray = []; 
        this.createSquares();
        this.createLaneSpeedArray();

        this.tileDimSmall = this.canvas.width < this.canvas.height ? this.canvas.width : this.canvas.height;
        this.tileDimHigh = this.canvas.width > this.canvas.height ? this.canvas.width : this.canvas.height;
        
        if ( this.canvas.width < this.canvas.height ) {
            this.tileSize = this.tileDimSmall / 7;
        } else {
            this.tileSize = ( this.tileDimSmall / 7 + this.tileDimHigh / 6 ) / 2 ;
        }

        this.spaceBetweenTiles = this.tileSize / 8;
    }


    
    setShineAnimationParam() {
        this.prevTileNumber = null;
        this.tilesShineArrayIndex = [];
        this.shineTilesNumber = 10;
        this.shineTilesIndex = 0;
        this.currentShinningTile = null;
        for( let i = 0; i < this.shineTilesNumber; i++ ) {
            const random = Math.floor(Math.random() * ( this.contentTilesArray.length ) );
            if ( this.tilesShineArrayIndex.includes( random ) ) {
                i--;
                continue;
            }
            this.tilesShineArrayIndex.push( random );
        }
        this.backgroundTile = this.contentTilesArray[ this.tilesShineArrayIndex[ this.tilesShineArrayIndex.length - 1 ] ];
    }

    extractBackgroundContentTile() {
        this.backgroundTileExtracted = new CanvasTileContent( 
            this.context, 
            this.canvas, 
            this.backgroundTile.x, 
            this.backgroundTile.y, 
            this.backgroundTile.width, 
            this.backgroundTile.height, 
            this.backgroundTile.borderRadius, 
            this.backgroundTile.animationBorderEnd, 
            this.backgroundTile.animationBorderStart, 
            this.backgroundTile.blur
        );
        this.backgroundTileExtracted.copyTextArray( [...this.backgroundTile.getTextArray() ] );
        this.backgroundTileExtracted.setTextOpacity( 0.0 );
    }

    generateMultiContentTiles() {
        const text = document.querySelector( '#background-small-tile-text' ).innerHTML;
        const tileSize = this.tileSize;
        const spaceBetweenTiles = this.spaceBetweenTiles;
        const midTilePos = ( this.canvas.width / 2 ) - ( tileSize / 2 );
        let leftTilePos = midTilePos - tileSize - spaceBetweenTiles;
        let rightTilePos = midTilePos + tileSize + spaceBetweenTiles;
        let posY = this.contentY;
        this.backgroundTilesStartY = posY;
        let blur = 3;
        let colNum = 0;
        while( posY + spaceBetweenTiles + tileSize < this.canvas.height ) {
            this.contentTilesArray.push( new CanvasTileContent( this.context, this.canvas, midTilePos, posY, tileSize, tileSize, spaceBetweenTiles, 0, 0, blur ) );
            colNum++;
            this.contentTilesArray[ this.contentTilesArray.length - 1 ].setAnimationPositions( midTilePos - this.canvas.width, midTilePos );
            while( leftTilePos >= tileSize && rightTilePos <= this.canvas.width - tileSize && rightTilePos ) {
                this.contentTilesArray.push( new CanvasTileContent( this.context, this.canvas, leftTilePos, posY, tileSize, tileSize, spaceBetweenTiles, 0, 0, blur ) );
                this.contentTilesArray[ this.contentTilesArray.length - 1 ].setAnimationPositions( leftTilePos - this.canvas.width, leftTilePos );
                this.contentTilesArray.push( new CanvasTileContent( this.context, this.canvas, rightTilePos, posY, tileSize, tileSize, spaceBetweenTiles, 0, 0, blur ) );
                this.contentTilesArray[ this.contentTilesArray.length - 1 ].setAnimationPositions( rightTilePos - this.canvas.width, rightTilePos );
                leftTilePos -= tileSize + spaceBetweenTiles;
                rightTilePos += tileSize + spaceBetweenTiles;
                this.backgroundTilesStartX = leftTilePos + tileSize + spaceBetweenTiles;
            }

            posY += spaceBetweenTiles + tileSize;
            leftTilePos = midTilePos - tileSize - spaceBetweenTiles;
            rightTilePos = midTilePos + tileSize + spaceBetweenTiles;
        }
        this.rowNum = this.contentTilesArray.length / colNum;
        this.colNum = colNum;
    }

    newContentIn( contentId ) {
        if ( this.contentTilesArray.length > 0 ) {
            return;
        }
        this.generateMultiContentTiles();
        this.currentState = "out";
        this.nextPage = contentId.replace( "-nav", "" );
        this.contentSpeedOut = 50;
        if( this.backgroundTileExtracted !== null ) {
            this.backgroundTileExtracted.setMoveOutSettings( this.backgroundTileExtracted.x + this.canvas.width );
        }
    }

    createAllTilesContent() {
        this.contentObjectsArray.push( this.createSingleTileContent(  'test-content', '/images/about_us.webp' ) );
    }

    createSingleTileContent( textSelectorId, imagePath, posX = this.contentX, posY = this.contentY ) {
        const tile = new CanvasTileContent( this.context, this.canvas, posX, posY, this.contentWidth, this.contentHeight, this.borderRadius );
        tile.colorUpdate( "rgba( 0, 0, 111, 0.5 )", "rgba( 255, 255, 255, 0.5 )" );
        const element = document.querySelector( '#' + textSelectorId );
        let content = element.innerHTML;
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        tile.addImage( imagePath );
        tile.setTextArray( content );

        return tile;
    }

    createLaneSpeedArray() {
        for( let i = 0; i < this.squareArray.length; i++ ) {
            let speed = Math.floor( Math.random() * 2 ) + 1;
            if ( i > 0 && speed === this.laneSpeedArray[ i - 1 ] ) {
                i--;

                continue;
            } 
            this.laneSpeedArray.push( speed );
        }
    }

    createSquares() {
        while( this.startDrawY + ( this.squareArray.length * this.squareSizeY ) + ( this.squareArray.length * this.squareSpaceY ) <= this.canvas.height - ( this.squareSizeY + this.squareSpaceY ) ) {
            let lineArray = [];
            while( this.startDrawX + ( lineArray.length * this.squareSizeX ) + ( lineArray.length * this.squareSpaceX ) < this.canvas.width - ( this.squareSizeX + this.squareSpaceX ) ) {
                const posX = this.startDrawX + ( this.squareSizeX * lineArray.length ) + ( this.squareSpaceX * lineArray.length ); 
                const posY = this.startDrawY + ( this.squareSizeY * this.squareArray.length ) + ( this.squareSpaceY * this.squareArray.length ); 
                lineArray.push( new CanvasTileContent( this.context, this.canvas, posX, posY, this.squareSizeX, this.squareSizeY, this.borderRadius, this.borderAnimationX + ( this.squareSizeX ), this.startDrawX ) );
            }
            this.squareArray.push( lineArray );
        }
        
    }

    drawCurrentPage() {
        switch ( this.currentPage ) {
            case "home":
                this.drawHomePage();
                console.log( "drawCurrentPage() in CanvasMAinContent ------------ HOME" );
                break;
            case "about":
                if ( this.currentState === 'contentEntry' ) {
                    
                }
                console.log( "drawCurrentPage() in CanvasMAinContent ------------ ABOUT" );
                break;
            case "offer":
                if ( this.currentState === 'contentEntry' ) {

                }
                console.log( "drawCurrentPage() in CanvasMAinContent ------------ OFFER" );
                break;
            case "partners":
                if ( this.currentState === 'contentEntry' ) {

                }
                console.log( "drawCurrentPage() in CanvasMAinContent ------------ PARTNERS" );
                break;
            case "contact":
                if ( this.currentState === 'contentEntry' ) {

                }
                console.log( "drawCurrentPage() in CanvasMAinContent ------------ CONTACT" );
                break;
        
            default:
                console.log( "drawCurrentPage() in CanvasMAinContent ------------ DEFAULT <- ERRRRRRRRORRRRRRR" );
                break;
        }
        
    }

    setCurrentPage() {
        switch ( this.currentPage ) {
            case "home":
                console.log( "drawCurrentPage() in CanvasMAinContent ------------ HOME" );
                break;
            case "about":
                this.setAboutPage();
                console.log( "drawCurrentPage() in CanvasMAinContent ------------ ABOUT" );
                break;
            case "offer":
                this.setOfferPage();
                console.log( "drawCurrentPage() in CanvasMAinContent ------------ OFFER" );
                break;
            case "partners":
                this.setPartnersPage();
                console.log( "drawCurrentPage() in CanvasMAinContent ------------ PARTNERS" );
                break;
            case "contact":
                this.setContactPage();
                console.log( "drawCurrentPage() in CanvasMAinContent ------------ CONTACT" );
                break;
            default:
                console.log( "drawCurrentPage() in CanvasMAinContent ------------ DEFAULT <- ERRRRRRRRORRRRRRR" );
                break;
        }
    }

    setPage( contentName, imagePath = null ) {
        const element = document.querySelector( '#' + contentName );
        let content = element.innerHTML;
        element.style.position = 'absolute';
        element.style.bottom = '9999px';
        if( imagePath !== null ) {
            this.backgroundTile.addImage( imagePath );
        }
        
        this.backgroundTile.setTextArray( content );
        
    }

    setPageHTML( contentName ) {
        this.contentElementHTML = document.querySelector( '#' + contentName );

        this.contentElementHTML.style.position = 'absolute';

        this.contentElementHTML.style.top = this.backgroundTile.startY + 'px';
        this.contentElementHTML.style.left = this.backgroundTile.startX + 'px';
        this.contentElementHTML.style.width = this.tileSize * this.rowNum + this.spaceBetweenTiles * ( this.rowNum - 1 ) + 'px'; 
        this.contentElementHTML.style.height = 'auto'; 
        this.contentElementHTML.style.opacity = 0.00;

    }

    setContentVisible() {
        let currentOpacity = parseFloat(this.contentElementHTML.style.opacity);
        if ( currentOpacity < 1.00 ) {
            currentOpacity += 0.01;
            this.contentElementHTML.style.opacity = currentOpacity.toString();
        }        
    }

    updateContentPosition() {
        if( this.backgroundTileExtracted !== null && this.backgroundTileExtracted.x != this.contentElementHTML.style.left ) {
            this.contentElementHTML.style.left = this.backgroundTileExtracted.x + 'px';
        }
        
    }

    setVirtualTextScreen() {
        this.backgroundTileExtracted.setVirtualTextScreen();
    }

    ///////////////////////////////////////////////////// HOME PAGE
    setHomePage() { 
        document.fonts.load('70px Roboto Mono').then( function () {
            this.fontSize = this.canvas.width / 25 ;
            this.fontName = 'Roboto Mono'; 
            this.context.save();
            this.context.fillStyle = "rgba(255, 255, 255, 1.0)";
            this.context.font = `${ this.fontSize }px ${ this.fontName }`;
            this.context.shadowColor = "rgba(255, 255, 255, 1.0)";
            this.context.shadowBlur = 20;
            this.context.shadowOffsetX = 0;
            this.context.shadowOffsetY = 0;
    
            this.context.beginPath();
            const text = document.querySelector('#home-text').innerHTML;
            const textWidth = this.context.measureText(text).width;
            const x = this.canvas.width / 2 - textWidth / 2 + this.contentSpeedOut;
            this.context.fillText(text, x, this.canvas.height / 2);
            this.context.closePath();
            this.context.restore();
    
            
            this.homeButton.style.paddingTop = this.canvas.height / 2 + "px";
            this.homeButton.style.fontSize = "24px";
            this.homeButton.style.left = this.contentSpeedOut + this.canvas.width / 2 - this.homeButton.offsetWidth / 2 + "px";
            
        }.bind( this ) );
    }

    drawHomePage() {
        this.clearCanvas();
        this.setHomePage();
    }
    ////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////// ABOUT
    setAboutPage() {
        this.setPageHTML( 'html-content' );
    }
    ////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////// OFFER
    setOfferPage() {
        this.setPageHTML( 'offer-content' );
    }

    ////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////// PARTNERS
    setPartnersPage() {
        this.setPageHTML( 'partners-content' );
    }
    ////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////// CONTACT
    setContactPage() {
        this.setPageHTML( 'contact-content' );
    }
    ////////////////////////////////////////////////////////////////////////////////////

    clearCanvas() {
        this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
    }

    drawBackgroundTiles() {
        this.contentTilesArray.forEach( ( tile ) => {
            tile.draw();
            if( this.currentState === "in" && tile.move( this.speedIn ) === false ) {
                this.currentState = "shine";
                this.setShineAnimationParam();
            }
            if( this.currentState === "expandEnd" && tile.move( this.speedOut ) === false ) {
                this.currentState = "contentEntry";
                //this.setContentEntryParam();
            }
            if( this.currentState === "contentEntry" ) {
                //console.log( "Opacity:  ", this.backgroundTileExtracted.opacity );
                if( this.backgroundTileExtracted.opacity < 1.0 || this.contentElementHTML.style.opacity < 1.0 ) {
                    //console.log( this.backgroundTileExtracted.opacity );
                    this.backgroundTileExtracted.setOpacity( this.opacitySpeed );
                } else {
                    this.currentState = "staticContent";
                }
            }
        } );
    }

    drawBackgroundExtractedTile() {
        if( this.backgroundTileExtracted === null ) {
            return;
        }
        
        this.backgroundTileExtracted.draw();
        this.backgroundTileExtracted.drawVirtualTextScreen();
    }

    replaceBackgroundTile() {
        if( this.contentTilesArray.length === this.rowNum * this.colNum &&
            this.backgroundTile.width === this.backgroundTileExtracted.width &&
            this.backgroundTile.height === this.backgroundTileExtracted.height ) {
                this.contentTilesArray.splice( this.tilesShineArrayIndex[ this.tilesShineArrayIndex.length - 1 ], 1 );
            }
    }

    animateShine() {
        while ( this.prevTileNumber === this.currentShinningTile ) {
            this.currentShinningTile = Math.floor( Math.random() * this.shineTilesNumber );
        }  
        let isLastTile = false;
        if ( this.shineTilesIndex === this.tilesShineArrayIndex.length - 1 ) {
            isLastTile = true;
        } 
        
        this.contentTilesArray[ this.tilesShineArrayIndex[ this.shineTilesIndex ] ].shine( isLastTile );
        if ( this.tilesShineArrayIndex.length >= this.shineTilesIndex &&
            this.contentTilesArray[ this.tilesShineArrayIndex[ this.shineTilesIndex ] ].shineStatus === 'done' ) {
            this.shineTilesIndex++
            
        } 
        if ( this.tilesShineArrayIndex.length < this.shineTilesIndex + 1 ) { 
            this.currentState = "expandBegin";
            this.contentTilesArray[ this.tilesShineArrayIndex[ this.tilesShineArrayIndex.length - 1 ] ].setMovePosition( this.backgroundTilesStartX, this.backgroundTilesStartY, this.speedBackgroundPos );
        }
    }

    animateTilesBackgroundOut() {

    }

    animateExpandBegin() {
        this.backgroundTile.expand();
        
        if ( this.backgroundTile.expandStatus === 'onPlace' ) {
            this.currentState = 'expandBackground';
            this.backgroundTile.setBorders( this.backgroundTile.x + this.backgroundTile.borderRadius, 
                                            this.backgroundTile.x + this.tileSize * this.rowNum + this.spaceBetweenTiles * ( this.rowNum - 1 ) - ( this.backgroundTile.borderRadius * 2 ), 
                                            this.backgroundTile.y + this.backgroundTile.borderRadius, 
                                            null );
            this.setCurrentPage();
            
            //const tilesContentBorderBottomY = this.contentElementHTML.getBoundingClientRect().height;
            const tilesContentBorderBottomY = this.colNum * this.tileSize + ( this.colNum - 1 ) * this.spaceBetweenTiles;
            // const height = this.backgroundTile.heightWithTextAndImageArray > tilesContentBorderBottomY ?
            //     this.backgroundTile.heightWithTextAndImageArray :
            //     tilesContentBorderBottomY;
            const height = this.contentElementHTML.getBoundingClientRect().height > tilesContentBorderBottomY ?
            this.contentElementHTML.getBoundingClientRect().height :
                tilesContentBorderBottomY;
                const text = this.contentElementHTML.getBoundingClientRect(); 
            this.backgroundTile.setResize( this.tileSize * this.rowNum + this.spaceBetweenTiles * ( this.rowNum - 1 ), 
                                           height,
                                           this.resizeSpeed );
            
            this.backgroundTile.heightWithTextAndImageArray;
            this.backgroundTile.canvasHeightWithTextAndImageArray;
                           
        }
    }

    animateBackgroundExpand() {
        this.backgroundTile.resize();
        if ( this.backgroundTile.expandStatus === 'onPlace' ) {
            this.currentState = 'expandEnd';
            this.setFooter();
            this.extractBackgroundContentTile();
            
            this.contentTilesArray.forEach( ( tile ) => {
                tile.setMoveOutSettings( tile.x + this.canvas.width );
            } );
        }
    }

    animateExpandEnd() {

    }

    draw() {
        switch ( this.currentState ) {
            case 'out':
                this.clearCanvas();
                this.update();
                this.updateContentPosition();
                this.drawCurrentPage();
                this.drawBackgroundExtractedTile();
                break;
            case 'in':
                this.clearCanvas();
                this.drawBackgroundTiles();
                break;
            case 'shine':
                this.clearCanvas();
                this.drawBackgroundTiles();
                this.animateShine();
                break;
            case 'expandBegin':
                this.clearCanvas();
                this.drawBackgroundTiles();
                this.animateExpandBegin();
                break;
            case 'expandBackground':
                this.clearCanvas();
                this.animateBackgroundExpand();
                this.drawBackgroundTiles();
                break;
            case 'expandEnd':
                this.clearCanvas();
                this.replaceBackgroundTile();
                this.setVirtualTextScreen();
                this.drawBackgroundExtractedTile();
                this.drawBackgroundTiles();
                break;
            case 'contentEntry':
                this.clearCanvas();
                this.setContentVisible();
                //this.drawCurrentPage();
                this.drawBackgroundExtractedTile();
                this.drawBackgroundTiles();
                break;
            case 'staticContent':
                this.clearCanvas();
                //this.drawCurrentPage();
                this.drawBackgroundExtractedTile();
                break;
            default:
                this.clearCanvas();
                this.drawBackgroundExtractedTile();
                break;
        }
    }

    update() {
        if ( this.currentState === "out" && this.contentSpeedOut < this.canvas.width ) {
            this.contentSpeedOut *= 1.1;
        } else if ( this.currentState === "out" && this.contentSpeedOut >= this.canvas.width ){
            //debugger
            if( this.backgroundTileExtracted === null ) {
                this.currentState = "in";
                this.contentSpeedOut = 0;
                this.currentPage = this.nextPage;
            } else if( this.backgroundTileExtracted.move( this.speedOut ) === false ) {
                this.currentState = "in";
                this.contentSpeedOut = 0;
                this.currentPage = this.nextPage;
                //this.backgroundTileExtracted.setDefaultSettings();
            }
        }
    }

}
