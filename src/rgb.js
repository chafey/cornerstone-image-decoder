/**
 */
var cornerstoneImageDecoder = (function (cornerstoneImageDecoder) {

    "use strict";

    if(cornerstoneImageDecoder === undefined) {
        cornerstoneImageDecoder = {};
    }

    function rgb(rgbBuffer, rgbaBuffer) {
        if(rgbBuffer === undefined) {
            throw "cornerstoneImageDecoder.rgb: rgbBuffer must not be undefined";
        }
        if(rgbBuffer.length % 3 !== 0) {
            throw "cornerstoneImageDecoder.rgb: rgbBuffer length must be divisble by 3";
        }

        var numPixels = rgbBuffer.length / 3;
        var rgbIndex = 0;
        var rgbaIndex = 0;
        for(var i= 0; i < numPixels; i++) {
            rgbaBuffer[rgbaIndex++] = rgbBuffer[rgbIndex++]; // red
            rgbaBuffer[rgbaIndex++] = rgbBuffer[rgbIndex++]; // green
            rgbaBuffer[rgbaIndex++] = rgbBuffer[rgbIndex++]; // blue
            rgbaBuffer[rgbaIndex++] = 255; //alpha
        }

    }

    // module exports
    cornerstoneImageDecoder.rgb = rgb;

    return cornerstoneImageDecoder;
}(cornerstoneImageDecoder));