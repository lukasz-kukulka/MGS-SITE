import React from 'react';
import ReactDOM from 'react-dom/client';
import BackgroundLights from './BackgroundLights';
import BackgroundContent from './BackgroundContent/Main';


//let height = document.getElementById( 'menu-bar' ).getBoundingClientRect().height;

ReactDOM.createRoot( document.getElementById( 'background-menu' ) ).render( <BackgroundContent /> );
ReactDOM.createRoot( document.getElementById( 'background' ) ).render( <BackgroundLights /> );

// const rootTest = ReactDOM.createRoot( document.getElementById( 'welcome-nav' ) );
// rootTest.render( <Wave height={ height } > Home </Wave> );

