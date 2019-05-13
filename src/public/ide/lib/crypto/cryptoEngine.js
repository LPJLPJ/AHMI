//created by Zzen1sS
//2019/5/7
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS

        module.exports = factory()
    } else {
        // Browser globals
        window.CrptoEngine = factory();
    }
}(function () {


    if ((typeof File !== 'undefined') && !File.prototype.slice) {
        if (File.prototype.webkitSlice) {
            File.prototype.slice = File.prototype.webkitSlice;
        }

        if (File.prototype.mozSlice) {
            File.prototype.slice = File.prototype.mozSlice;
        }
    }

    if (!window.File || !window.FileReader || !window.FileList || !window.Blob || !File.prototype.slice) {
        alert('File APIs are not fully supported in this browser. Please use latest Mozilla Firefox or Google Chrome.');
    }

    var is_crypto = window.crypto && window.crypto.subtle && window.crypto.subtle.digest;
    var supportedHash = []
    if (is_crypto) {
        supportedHash.push('hash_sha512')
        supportedHash.push('hash_sha384')
        supportedHash.push('hash_sha1')
        window.crypto.subtle.digest({
            name: "SHA-1"
        }, new Uint8Array()).catch(function (error) {
            supportedHash.pop()
        });
    }

    function hash_file(file, hasher, cb) {
        var i, buffer_size, block, threads, reader, blob, handle_hash_block, handle_load_block;
        // var lastErr = null
        handle_load_block = function (event) {
            // for (i = 0; i < workers.length; i += 1) {
            //     threads += 1;
            //     workers[i].postMessage({
            //         'message': event.target.result,
            //         'block': block
            //     });
            // }
            var result = hasher.calHash(event.target.result,block)
            if(result){
                return cb && cb(null,result)
            }else{
                handle_hash_block()
            }
            
        };
        handle_hash_block = function () {
            if (block.end !== file.size) {
                block.start += buffer_size;
                block.end += buffer_size;

                if (block.end > file.size) {
                    block.end = file.size;
                }
                reader = new FileReader();
                reader.onload = handle_load_block;
                reader.onerror = function(err){
                    if(err){
                        cb && cb(err)
                    }
                }
                blob = file.slice(block.start, block.end);

                reader.readAsArrayBuffer(blob);
            }
        };
        buffer_size = 64 * 16 * 1024;
        block = {
            'file_size': file.size,
            'start': 0
        };

        block.end = buffer_size > file.size ? file.size : buffer_size;
        threads = 0;

        
        reader = new FileReader();
        reader.onload = handle_load_block;
        reader.onerror = function(err){
            if(err){
                cb && cb(err)
            }
        }
        blob = file.slice(block.start, block.end);

        reader.readAsArrayBuffer(blob);
    }



    // function handle_crypto_progress(id, total, loaded) {
    //     console.log(loaded * 100 / total + '%');
    // }


    // function handle_crypto_file(file, algo) {

    //     var handle_crypto_block = function (data, algo) {

    //         if (algo) {
    //             window.crypto.subtle.digest({
    //                     name: algo
    //                 }, data)
    //                 .then(function (hash) {
    //                     var hexString = '',hashResult = new Uint8Array(hash);

    //                     for (var i = 0; i < hashResult.length; i++) {
    //                         hexString += ("00" + hashResult[i].toString(16)).slice(-2);
    //                     }
    //                     $(algo.id).parent().html(hexString);

    //                 })
    //                 .catch(function (error) {
    //                     console.error(error);
    //                 });
    //         }
    //     };
    //     var reader = new FileReader();

    //     reader.onload = function (event) {
    //         handle_crypto_block(event.target.result, algo);
    //     }

    //     reader.readAsArrayBuffer(file);
    // };


    function MD5Hasher(){

        this.hash = [1732584193, -271733879, -1732584194, 271733878];

    }

    MD5Hasher.prototype.calHash = function(message,block){
        var uint8_array, output, nBitsTotal, nBitsLeft, nBitsTotalH, nBitsTotalL;

        uint8_array = new Uint8Array(message);
        message = Crypto.util.endian(Crypto.util.bytesToWords(uint8_array));

        if (block.end === block.file_size) {

            nBitsTotal =  block.file_size * 8;
            nBitsLeft = (block.end - block.start) * 8;

            // Add padding
            message[nBitsLeft >>> 5] |= 0x80 << (nBitsLeft % 32);

            nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
            nBitsTotalL = nBitsTotal & 0xFFFFFFFF;

            message[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotalH;
            message[(((nBitsLeft + 64) >>> 9) << 4) + 14] = nBitsTotalL;

            this.hash = Crypto.md5(message, this.hash);

            return Crypto.util.bytesToHex(Crypto.util.wordsToBytes(Crypto.util.endian(this.hash)));
        } else {
            this.hash = Crypto.md5(message, this.hash);
        }


        
    }

    var cryptoEngine = {}
    cryptoEngine.hashMD5 = function(file,cb){
        return hash_file(file,new MD5Hasher(),cb)
    }
    return cryptoEngine
    
}))