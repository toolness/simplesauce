## Quick Start

    $ cp config.sample.js config.js
    
Edit `config.js` as necessary.

    $ npm install
    $ npm test
    $ node test/integration/run-post-receive-webhook-test.js

If all this works, you are ready to spin up the server:

    $ node app.js

## Adding Simplesauce Support To A Project

Currently, simplesauce only supports running QUnit-based tests located
at `/test/index.html` in a repository.

To add support for simplesauce, add the following code after all the script 
tags to `/test/index.html`:

```html
<script>
if (location.search.match(/externalreporter=1/))
  document.write('<script src="/externalreporter.js"></' + 'script>');
</script>
```
