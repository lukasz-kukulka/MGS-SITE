<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BackgroundSentenceController extends Controller
{
    public function getSentence() {
        $locale = config('app.locale');
        // dd( $locale);
        if ( session()->has( 'applocale' ) ) {
            $locale = session( 'applocale' );
        }
        $sentencesData = include resource_path( 'lang/' . $locale . '/background_sentence.php' );
        return response()->json( $sentencesData );
        // $sentencesData = include resource_path( 'lang/' . session( 'applocale' ) . '/background_sentence.php' );
        // try {
        //     if ( !session()->has( 'applocale' ) ) {
        //         return response()->json( [ 'error' => 'Session key not found' ], 400 );
        //     }

        //     $sentencesData = include resource_path( 'lang/' . session( 'applocale' ) . '/background_sentence.php' );

        //     if (!$sentencesData) {
        //         return response()->json( [ 'error' => 'Could not load translation file' ], 500 );
        //     }

        //     return response()->json( $sentencesData );
        // } catch ( \Exception $e ) {
        //     return response()->json( [ 'error' => $e->getMessage() ], 500 );
        // }
    }
}
