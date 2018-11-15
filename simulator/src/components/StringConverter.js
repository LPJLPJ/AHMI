var StringConverter = {}


var supportedEncodings = {
    ascii:'ascii',
    'utf-8':'utf-8',
    gb2312:'gb2312'
}

var convertStrToUint8Array=function (str,encoding) {
    encoding = encoding || supportedEncodings.ascii
    var uint8array
    switch (encoding) {
        case supportedEncodings.ascii:
        case supportedEncodings.gb2312:
            uint8array = new TextEncoder(encoding, {NONSTANDARD_allowLegacyEncoding: true}).encode(str);
            break;
        case supportedEncodings['utf-8']:
            uint8array = new TextEncoder().encode(str);
            break;
        default:
            console.log('unsupported encoding')
    }
    return uint8array
}

var convertUint8ArrayToStr=function (buf,encoding) {
    encoding = encoding||supportedEncodings.ascii
    var str = ''
    if(buf){
        switch (encoding){
            case supportedEncodings.ascii:
            case supportedEncodings['utf-8']:
            case supportedEncodings.gb2312:
                str = new TextDecoder(encoding).decode(buf);
                break;

            default:
                console.log('unsupported encoding')
        }
    }

    return str
}

StringConverter.supportedEncodings = supportedEncodings
StringConverter.convertStrToUint8Array = convertStrToUint8Array
StringConverter.convertUint8ArrayToStr = convertUint8ArrayToStr

module.exports = StringConverter