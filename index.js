const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

/*
 * Define the template engine to be used
 * Express handlebars looks for layouts inside our views/layouts folder by default
 */
app.engine('handlebars', expressHandlebars({ defaultLayout: 'index' }));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('home/index');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('\x1b[35m%s\x1b[0m', `\nThe server is running on port ${port}`);
});
