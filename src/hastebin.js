const got = require('got');

function createPaste (content, options, gotOptions) {
  gotOptions = gotOptions || {};
  if (typeof content !== 'string') {
    return Promise.reject(new Error('You cannot send that. Please include a "content" argument that is a valid string.'));
  }

  if (content === '') {
    return Promise.reject(new Error('You cannot send nothing.'));
  }

  const hasteServer = (options ? options.server : null) || 'https://hastebin.com';
  const postUrl = new URL('/documents', hasteServer);

  const resolvedGotOptions = Object.assign({
    body: content,
    headers: {
      'Content-Type': (options ? options.contentType : null) || 'text/plain'
    }
  });

  return got.post(postUrl, resolvedGotOptions).then(function (result) {
    if (!result.body || !result.body.key) {
      throw new Error('Did not receive hastebin key.');
    }

    if ((options ? options.raw : null)) {
      return new URL('raw/' + result.body.key, hasteServer);
    } else {
      return new URL(result.body.key, hasteServer);
    }
  });
}

exports.createPaste = createPaste;
