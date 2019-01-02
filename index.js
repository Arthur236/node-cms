const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');

const mainRoutes = require('./routes/home/index');
const authRoutes = require('./routes/auth/index');
const adminRoutes = require('./routes/admin/index');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

/*
 * Define the template engine to be used
 * Express handlebars looks for layouts inside our views/layouts folder by default
 */
app.engine('handlebars', expressHandlebars({ defaultLayout: 'index' }));
app.set('view engine', 'handlebars');

app.use('/', mainRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log('\x1b[35m%s\x1b[0m', `\nThe server is running on port ${port}`);
});
