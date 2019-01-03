require('dotenv').config();

const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');

const mainRoutes = require('./routes/home/index');
const authRoutes = require('./routes/auth/index');
const adminRoutes = require('./routes/admin/index');
const posts = require('./routes/admin/posts');

const { select } = require('./utils/handlebarsHelpers');

const app = express();

mongoose.connect('mongodb://localhost:27017/node-cms',  { useNewUrlParser: true })
  .then((db) => {
    console.log("DB connected")
  }).catch((error) => {
    console.log("Could not connect to DB: ", error);
});

app.use(express.static(path.join(__dirname, 'public')));

/*
 * Define the template engine to be used
 * Express handlebars looks for layouts inside our views/layouts folder by default
 */
app.engine('handlebars', expressHandlebars({ defaultLayout: 'index', helpers: { selectHelper: select } }));
app.set('view engine', 'handlebars');

app.use(upload());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(methodOverride('_method'));

app.use('/', mainRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/admin/posts', posts);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log('\x1b[35m%s\x1b[0m', `\nThe server is running on port ${port}`);
});
