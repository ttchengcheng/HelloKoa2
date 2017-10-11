const fs = require('fs')
const path = require('path')

function condition(check, mw) {
    return async function (ctx, next) {
        if (!check(ctx)) {
            await next();
        } else {
            // must .call() to explicitly set the receiver
            await mw.call(this, ctx, next);
        }
    };
}

function isMultipart(ctx) {
    return 'POST' == ctx.method || ctx.request.type == "multipart/form-data";
}
// handle upload
function upload() {
    return condition(isMultipart, async function (ctx, next) {
        for (var file of ctx.request.files) {
            const reader = fs.createReadStream(file.path);
            const stream = fs.createWriteStream(path.join(__dirname + '/../uploaded_files', file.name));
            reader.pipe(stream);
            console.log('uploading %s -> %s', file.name, stream.path);
        }

        ctx.redirect('/');
    });
}

module.exports = upload;