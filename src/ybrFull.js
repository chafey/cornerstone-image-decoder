/**
 */
var cornerstoneImageDecoder = (function (cornerstoneImageDecoder) {

    "use strict";

    if(cornerstoneImageDecoder === undefined) {
        cornerstoneImageDecoder = {};
    }

    function ybrFull(ybrBuffer, rgbaBuffer) {
        if(ybrBuffer === undefined) {
            throw "cornerstoneImageDecoder.ybrFull: ybrBuffer must not be undefined";
        }
        if(ybrBuffer.length % 3 !== 0) {
            throw "cornerstoneImageDecoder.ybrFull: ybrBuffer length must be divisble by 3";
        }

        var numPixels = ybrBuffer.length / 3;
        var ybrIndex = 0;
        var rgbaIndex = 0;
        for(var i= 0; i < numPixels; i++) {
            var y = ybrBuffer[ybrIndex++];
            var cb = ybrBuffer[ybrIndex++];
            var cr = ybrBuffer[ybrIndex++];
            rgbaBuffer[rgbaIndex++] = y + 1.40200 * (cr - 128);// red
            rgbaBuffer[rgbaIndex++] = y - 0.34414 * (cb -128) - 0.71414 * (cr- 128); // green
            rgbaBuffer[rgbaIndex++] = y + 1.77200 * (cb - 128); // blue
            rgbaBuffer[rgbaIndex++] = 255; //alpha
        }

    }

    // module exports
    cornerstoneImageDecoder.ybrFull = ybrFull;

    return cornerstoneImageDecoder;
}(cornerstoneImageDecoder));