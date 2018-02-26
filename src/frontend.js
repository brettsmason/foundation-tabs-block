import whatInput from 'what-input';
import Foundation from './foundation';

(function($) {
	const el = document.querySelector('[data-tabs]');

	if( el ) {
		$('[data-tabs]').foundation();
	}
})( jQuery );
