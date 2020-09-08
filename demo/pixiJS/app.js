const path = require('path')
const express = require('express')
const app = new express();
const port = process.env.PORT || 8080;

app.use(express.static('public'));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
  
  
})

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
  }
});
