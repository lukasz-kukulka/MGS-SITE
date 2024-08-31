import { CanvasTileContent } from "./CanvasTileContent";

export default class CanvasMainContent {
    constructor( context, canvas ) {
        this.setDefault( context, canvas );
    }

    setDefault( context, canvas ) {
        this.canvas = canvas;
        this.context = context;
        this.squareArray = [];
        this.laneSpeedArray = [];

        this.startDrawX = 0;
        this.startDrawY = 200;

        this.contentX = ( this.canvas.width / 3 * 2 ) - ( this.canvas.width / 2 );
        this.contentY = this.canvas.height / 7;
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

        this.contentObjectsArray = []; 
        this.createSquares();
        this.createLaneSpeedArray();
        
        this.currentPage = "home"; //home, about, offer, partners, contact
        this.nextPage = "home"; //home, about, offer, partners, contact
        this.contentSpeedOut = 0;

        console.log( context.font );
        
        this.homeButton = document.querySelector( '#home-button' );
        this.homeButton.style.position = 'fixed';
        this.homeButton.addEventListener('click', () => {
            this.newContentIn('offer-nav');
        });
        this.drawHomePage();
        this.currentState = "static"; // static, out, in, shine, expandBegin, expandBackground, expandEnd
        this.contentTilesArray = [];
        this.tileDimSmall = this.canvas.width < this.canvas.height ? this.canvas.width : this.canvas.height;
        this.tileDimHigh = this.canvas.width > this.canvas.height ? this.canvas.width : this.canvas.height;
        
        if ( this.canvas.width < this.canvas.height ) {
            this.tileSize = this.tileDimSmall / 7;
        } else {
            this.tileSize = ( this.tileDimSmall / 7 + this.tileDimHigh / 6 ) / 2 ;
        }

        this.spaceBetweenTiles = this.tileSize / 8;
        //debugger
    } 
    
    setShineAnimationParam() {
        //debugger;
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
            //console.log( tilesShineArrayIndex );
            this.tilesShineArrayIndex.push( random );
        }
        this.backgroundTile = this.contentTilesArray[ this.tilesShineArrayIndex[ this.tilesShineArrayIndex.length - 1 ] ];
    }

    generateMultiContentTiles() {
        const text = document.querySelector( '#background-small-tile-text' ).innerHTML;
        const tileSize = this.tileSize;
        const spaceBetweenTiles = this.spaceBetweenTiles;
        const midTilePos = this.canvas.width / 2 - tileSize / 2;
        let leftTilePos = midTilePos - tileSize - spaceBetweenTiles;
        let rightTilePos = midTilePos + tileSize + spaceBetweenTiles;
        let posY = this.contentY;
        this.backgroundTilesStartY = posY;
        //constructor( context, canvas, x, y, width, height, radius, animationBorderEnd = 0, animationBorderStart = 0, blur = 0 )
        //debugger;
        let blur = 3;
        
        while( posY + spaceBetweenTiles + tileSize < this.canvas.height ) {
            this.contentTilesArray.push( new CanvasTileContent( this.context, this.canvas, midTilePos, posY, tileSize, tileSize, spaceBetweenTiles, 0, 0, blur ) );
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
        this.lastTilePosX = this.canvas.width + this.contentTilesArray.at( -1 ).x;
        //this.lastTilePosX = this.canvas.width - ( this.contentTilesArray.at( -1 ).x + tileSize + spaceBetweenTiles );
        //debugger
        // this.contentTilesArray.forEach( ( tile ) => {
        //     // tile.addImage( '/images/about_us.webp' );
        //     tile.setTextArray( text, 0.15 );
        // } );
        
    }

    newContentIn( contentId ) {
        if ( this.contentTilesArray.length > 0 ) {
            return;
        }
        this.generateMultiContentTiles();
        this.currentState = "out";
        this.nextPage = contentId.replace( "-nav", "" );
        this.contentSpeedOut = 50;
        console.log( "CanvasMainContent->newContentIn : ", contentId, "next page: ", this.nextPage, "tiles: ", this.contentTilesArray );
    }

    createAllTilesContent() {
        this.contentObjectsArray.push( this.createSingleTileContent(  'test-content', '/images/about_us.webp' ) );
        // this.contentObjectsArray.push( this.createSingleTileContent(  'test-content', '/images/our_offer_3.webp' ) );
        // this.contentObjectsArray.push( this.createSingleTileContent(  'test-content', '/images/our_partners.webp' ) );
    }

    createSingleTileContent( textSelectorId, imagePath, posX = this.contentX, posY = this.contentY ) {
        //console.log( this.context, this.canvas, posX, posY, this.contentWidth, this.contentHeight, this.borderRadius );
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
        console.log( this.laneSpeedArray )
    }

    createSquares() {
        while( this.startDrawY + ( this.squareArray.length * this.squareSizeY ) + ( this.squareArray.length * this.squareSpaceY ) <= this.canvas.height - ( this.squareSizeY + this.squareSpaceY ) ) {
            let lineArray = [];
            while( this.startDrawX + ( lineArray.length * this.squareSizeX ) + ( lineArray.length * this.squareSpaceX ) < this.canvas.width - ( this.squareSizeX + this.squareSpaceX ) ) {
                const posX = this.startDrawX + ( this.squareSizeX * lineArray.length ) + ( this.squareSpaceX * lineArray.length ); 
                const posY = this.startDrawY + ( this.squareSizeY * this.squareArray.length ) + ( this.squareSpaceY * this.squareArray.length ); 
                lineArray.push( new CanvasTileContent( this.context, this.canvas, posX, posY, this.squareSizeX, this.squareSizeY, this.borderRadius, this.borderAnimationX + ( this.squareSizeX ), this.startDrawX ) );
                console.log( lineArray.length * this.squareSizeX );
            }
            this.squareArray.push( lineArray );
        }
        
    }

    drawCurrentPage() {
        switch ( this.currentPage ) {
            case "home":
                this.drawHomePage();
                break;
            case "about":
                
                break;
            case "offer":
                
                break;
            case "partners":
                
                break;
            case "contact":
                
                break;
        
            default:
                break;
        }
        
    }

    ///////////////////////////////////////////////////// HOME PAGE
    setHomePage() { 
        document.fonts.load('70px Roboto Mono').then( function () {
            //console.log( "setHomePage()" );
            this.context.save();
            this.context.fillStyle = "rgba(255, 255, 255, 1.0)";
            this.context.font = "70px Roboto Mono";
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
        //this.homeButton.style.left = this.canvas.width / 2 - this.homeButton.offsetWidth / 2 + this.homePagePosX + 'px';
        // this.contentObjectsArray.forEach( ( tile ) => { 
        //     tile.draw();
        // } );
    }
    ////////////////////////////////////////////////////////////////////////////////////

    clearCanvas() {
        this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
    }

    drawBackgroundTiles() {
        //console.log( 'drawBackgroundTiles()' , this.contentTilesArray );
        this.contentTilesArray.forEach( ( tile ) => {
            tile.draw();
            //debugger
            if( this.currentState === "in" && tile.moveIn( 50 ) === false ) {
                this.currentState = "shine";
                this.setShineAnimationParam();
            }
        } );

        
    }

    animateShine() {
        while ( this.prevTileNumber === this.currentShinningTile ) {
            this.currentShinningTile = Math.floor( Math.random() * this.shineTilesNumber );
        }  
        // if( this.shineTilesIndex === 9 )  { 
        //     debugger
        // }
        let isLastTile = false;
        if ( this.shineTilesIndex === this.tilesShineArrayIndex.length - 1 ) {
            isLastTile = true;
            //debugger
        } 
        

        //debugger;
        this.contentTilesArray[ this.tilesShineArrayIndex[ this.shineTilesIndex ] ].shine( isLastTile );
        if ( this.tilesShineArrayIndex.length >= this.shineTilesIndex &&
            this.contentTilesArray[ this.tilesShineArrayIndex[ this.shineTilesIndex ] ].shineStatus === 'done' ) {
            this.shineTilesIndex++
            //debugger;
            
        } 
        if ( this.tilesShineArrayIndex.length < this.shineTilesIndex + 1 ) { 
            //debugger
            this.currentState = "expandBegin";
            this.contentTilesArray[ this.tilesShineArrayIndex[ this.tilesShineArrayIndex.length - 1 ] ].setMovePosition( this.backgroundTilesStartX, this.backgroundTilesStartY );
        }
    }

    animateTilesBackgroundOut() {

    }

    animateExpandBegin() {
        // const animateTile = this.contentTilesArray[ this.tilesShineArrayIndex[ this.tilesShineArrayIndex.length - 1 ] ];
        this.backgroundTile.expand();
        if ( this.backgroundTile.expandStatus === 'onPlace' ) {
            this.currentState = 'expandBackground';
            this.backgroundTile.setResize( this.lastTilePosX, this.contentHeight );
            //debugger
        }
    }

    animateBackgroundExpand() {
        //debugger;
        this.backgroundTile.resize();
        if ( this.backgroundTile.expandStatus === 'onPlace' ) {
            this.currentState = 'expandEnd';
            //debugger;
        }
    }

    animateExpandEnd() {

    }

    draw() {
        switch ( this.currentState ) {
            case 'out':
                this.update();
                this.clearCanvas();
                this.drawCurrentPage();
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
                this.drawBackgroundTiles();
                this.animateBackgroundExpand();
                break;
            default:
                //debugger
                break;
        }
        //this.drawCurrentPage();

        // this.squareArray.forEach( ( singleLane ) => {
        //     singleLane.forEach( ( singleElement ) => {
        //         singleElement.draw();
        //     } );
        // } );
        // console.log( "Canvas width: ", this.canvas.width );
        // this.context.font = '20px Roboto Mono';
        // this.context.fillStyle = 'white';
        // this.context.fillText(this.content, this.startDrawX, this.canvas.height / 7 + 20);
        
        // this.square.draw();   
        // this.setHomePage();
        // // const currentLeft = window.getComputedStyle( this.homeButton ).left; 
        // this.homeButton.style.left = this.canvas.width / 2 - this.homeButton.offsetWidth / 2 + this.homePagePosX + 'px';
        // this.contentObjectsArray.forEach( ( tile ) => { 
        //     tile.draw();
        // } );
    }

    update() {
        //console.log( 'update()', this.contentSpeedOut );
        
        if ( this.currentState === "out" && this.contentSpeedOut < this.canvas.width ) {
            this.contentSpeedOut *= 1.1;
        } else if ( this.currentState === "out" && this.contentSpeedOut >= this.canvas.width ){
            this.currentState = "in";
            this.contentSpeedOut = 0;
            this.currentPage = this.nextPage;
        }
        // this.squareArray.forEach( ( singleLane, index ) => {
        //     let speed = this.laneSpeedArray[ index ];
        //     singleLane.forEach( ( singleElement ) => {
        //         singleElement.update( speed );
        //     } );
        // } );
    }

    moveOut() {
        // this.startDrawX += 1.0;
        // this.square.moveOut();
    }
}
