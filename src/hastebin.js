import got from 'got';

function createPaste (content, options, gotOptions) {
  gotOptions = gotOptions || {};
  if (typeof content !== 'string') {
    return Promise.reject(new Error('You cannot send that. Please include a "content" argument that is a valid string.'));
  }

  if (content === '') {
    return Promise.reject(new Error('You cannot send nothing.'));
  }

  const hasteServer = (options ? options.server : null) || 'https://hastebin.com';
  const postUrl = new URL(hasteServer, 'documents');

  const resolvedGotOptions = Object.assign({
    body: content,
    json: true,
    headers: {
      'Content-Type': (options ? options.contentType : null) || 'text/plain'
    }
  });

  return got(postUrl, resolvedGotOptions).then(function (result) {
    if (!result.body || !result.body.key) {
      throw new Error('Did not receive hastebin key.');
    }

    if ((options ? options.raw : null)) {
      return new URL(hasteServer, 'raw/' + result.body.key);
    } else {
      return new URL(hasteServer, result.body.key);
    }
  });
}

exports.createPaste = createPaste;
