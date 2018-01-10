class TranslateService {

  consructor(key) {
    if (key) {
      this._apiKey = key;
    }
  }

  applyApiKey(key) {
    this._apiKey = key;
  }

  translate(lang, str) {
    // Google Translate API is a paid (but dirt cheap) service. This is my key
    // and will be disabled by the time the video is out. To generate your own,
    // go here: https://cloud.google.com/translate/v2/getting_started
  	const url =
      'https://www.googleapis.com' +
      '/language/translate/v2' +
    	'?key=' + this._apiKey +
      '&source=en' +
      '&target=' + lang +
      '&q=' + encodeURIComponent(str);

    return fetch(url)
   		.then(response => response.json())
  	  .then(parsedResponse => parsedResponse
      	.data
        .translations[0]
        .translatedText
      );
  }

}


module.exports = new TranslateService();
