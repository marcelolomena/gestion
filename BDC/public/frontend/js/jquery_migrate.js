// Borrowed from jQuery 1.8.3's source code
jQuery.fn.extend({
  live: function( types, data, fn ) {
          if( window.console && console.warn ) {
           console.warn( "jQuery.live is deprecated. Use jQuery.on instead." );
          }

          jQuery( this.context ).on( types, this.selector, data, fn );
          return this;
        }
});