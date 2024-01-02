
const crypto = require('crypto');

export const codeGenerator = (length: number) => {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()_-+';
    var code = '';
    for (var i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

export const numberGenerator = (length: number) => {
    var chars = '0123456789';
    var code = '';
    for (var i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

export const HashMD5Generator = (data: string) => {
    const hash = crypto.createHash('md5');
    hash.update(data);
    return hash.digest('hex');
  }
