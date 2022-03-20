$( function() {
    /*--------------------------------------
     #User Object
     --------------------------------------*/

    var User = {
        handle : '@bebaps',
        img : 'bebaps.jpg',
    };

    /*--------------------------------------
     #State Management
     --------------------------------------*/

    $( 'main' ).on( 'click', 'textarea', function() {
        $( this ).parents( 'form' ).addClass( 'expand' );
    } );

    $( '.tweets' ).on( 'click', '.thread > .tweet', function() {
        $( this ).parents( '.thread' ).toggleClass( 'expand' );
    } );

    /*--------------------------------------
     #Templating
     --------------------------------------*/

    /**
     * Compile Templates
     */
    var tweet   = Handlebars.compile( $( '#template-tweet' ).html() );
    var compose = Handlebars.compile( $( '#template-compose' ).html() );
    var thread  = Handlebars.compile( $( '#template-thread' ).html() );

    /**
     * Create New Tweet
     */
    function renderTweet( User, message ) {
        var data = {
            handle : User.handle,
            img : User.img,
            message : message
        };
        return tweet( data );
    };

    /**
     * Compose Area
     */
    function renderCompose() {
        return compose();
    }

    /**
     * Create a New Thread
     */
    function renderThread( User, message ) {
        var getTweet   = renderTweet( User, message );
        var getCompose = renderCompose();

        var getThread = {
            tweetTemplate : getTweet,
            composeTemplate : getCompose
        };
        return thread( getThread );
    }

    /*--------------------------------------
     #Composition
     --------------------------------------*/

    $( document ).on( 'submit', 'form', function() {
        event.preventDefault();
        message = $( 'textarea', this ).val();

        if ( $( this ).parent( 'header' ).length ) {
            $( '.tweets' ).append( renderThread( User, message ) );
        } else {
            $( this ).parent().append( renderTweet( User, message ) );
        }

        $( 'textarea' ).val( '' );
        $( 'form' ).removeClass( 'expand' );
    } );

} );
