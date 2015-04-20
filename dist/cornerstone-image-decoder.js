/*! cornerstone-image-decoder - v0.1.0 - 2015-04-20 | (c) 2015 Chris Hafey | https://github.com/chafey/cornerstone-image-decoder */
var cornerstoneImageDecoder = (function (cornerstoneImageDecoder) {

    "use strict";

    if(cornerstoneImageDecoder === undefined) {
        cornerstoneImageDecoder = {};
    }

    function palette( pixels, rgbaBuffer, dataSet ) {
        var len=dataSet.int16('x00281101',0);
        var start=dataSet.int16('x00281101',1);
        var bits=dataSet.int16('x00281101',2);
        var shift = (bits===8 ? 0 : 8 );

        var buffer = dataSet.byteArray.buffer;
        var rData=new Uint16Array( buffer, dataSet.elements.x00281201.dataOffset, len );
        var gData=new Uint16Array( buffer, dataSet.elements.x00281202.dataOffset, len );
        var bData=new Uint16Array( buffer, dataSet.elements.x00281203.dataOffset, len );

        var numPixels = dataSet.uint16('x00280010') * dataSet.uint16('x00280011');
        var palIndex=0;
        var rgbaIndex=0;

        for( var i=0 ; i < numPixels ; ++i ) {
            var value=pixels[palIndex++];
            if( value < start )
                value=0;
            else if( value > start + len -1 )
                value=len-1;
            else
                value=value-start;

            rgbaBuffer[ rgbaIndex++ ] = rData[value] >> shift;
            rgbaBuffer[ rgbaIndex++ ] = gData[value] >> shift;
            rgbaBuffer[ rgbaIndex++ ] = bData[value] >> shift;
            rgbaBuffer[ rgbaIndex++ ] = 255;
        }

    }

    // module exports
    cornerstoneImageDecoder.palette = palette;

    return cornerstoneImageDecoder;
}(cornerstoneImageDecoder));
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
/**
 */
var cornerstoneImageDecoder = (function (cornerstoneImageDecoder) {

    if(cornerstoneImageDecoder === undefined) {
        cornerstoneImageDecoder = {};
    }

    function rle( pixelFormat, samplesPerPixel, frameData, width, height) {
        var frameSize = width*height;
        var buffer;
        if( pixelFormat===1 ) {
            buffer = new ArrayBuffer(frameSize*samplesPerPixel);
            decode8( frameData, buffer, frameSize );
            return new Uint8Array(buffer);
        } else if( pixelFormat===2 ) {
            buffer = new ArrayBuffer(frameSize*samplesPerPixel*2);
            decode16( frameData, buffer, frameSize );
            return new Uint16Array(buffer);
        } else if( pixelFormat===3 ) {
            buffer = new ArrayBuffer(frameSize*samplesPerPixel*2);
            decode16( frameData, buffer, frameSize );
            return new Int16Array(buffer);
        }
    }

    function decode8( frameData, outFrame, frameSize ) {
        var header=new DataView(frameData.buffer, frameData.byteOffset);
        var data=new DataView( frameData.buffer, frameData.byteOffset );
        var out=new DataView( outFrame );

        var numSegments = header.getInt32(0,true);
        for( var s=0 ; s < numSegments ; ++s ) {
            var outIndex = s * frameSize;

            var inIndex=header.getInt32( (s+1)*4,true);
            var maxIndex=header.getInt32( (s+2)*4,true);
            if( maxIndex===0 )
                maxIndex = frameData.length;

            while( inIndex < maxIndex ) {
                var n=data.getInt8(inIndex++);
                if( n >=0 && n <=127 ) {
                    for( var i=0 ; i < n+1 && outIndex < frameSize; ++i ) {
                        out.setInt8(outIndex++, data.getInt8(inIndex++));
                    }
                } else if( n<= -1 && n>=-127 ) {
                    var value=data.getInt8(inIndex++);
                    for( var j=0 ; j < -n+1 && outIndex < frameSize; ++j ) {
                        out.setInt8(outIndex++, value );
                    }
                } else if (n===-128)
                    ; // do nothing
            }
        }
    }

    function decode16( frameData, outFrame, frameSize ) {
        var header=new DataView(frameData.buffer, frameData.byteOffset);
        var data=new DataView( frameData.buffer, frameData.byteOffset );
        var out=new DataView( outFrame );

        var numSegments = header.getInt32(0,true);
        for( var s=0 ; s < numSegments ; ++s ) {
            var outIndex=0;
            var highByte=( s===0 ? 1 : 0);

            var inIndex=header.getInt32( (s+1)*4,true);
            var maxIndex=header.getInt32( (s+2)*4,true);
            if( maxIndex===0 )
                maxIndex = frameData.length;

            while( inIndex < maxIndex ) {
                var n=data.getInt8(inIndex++);
                if( n >=0 && n <=127 ) {
                    for( var i=0 ; i < n+1 && outIndex < frameSize ; ++i ) {
                        out.setInt8( (outIndex*2)+highByte, data.getInt8(inIndex++) );
                        outIndex++;
                    }
                } else if( n<= -1 && n>=-127 ) {
                    var value=data.getInt8(inIndex++);
                    for( var j=0 ; j < -n+1 && outIndex < frameSize ; ++j ) {
                        out.setInt8( (outIndex*2)+highByte, value );
                        outIndex++;
                    }
                } else if (n===-128)
                    ; // do nothing
            }
        }
    }

    // module exports
    cornerstoneImageDecoder.rle = rle;

    return cornerstoneImageDecoder;
}(cornerstoneImageDecoder));
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