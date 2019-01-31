const moment = require('moment');

module.exports = {
  select: (selected, options) => (
    options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$&selected="selected"')
  ),

  formatDate: (date, format = 'MM-DD-YYY') => (
    moment(date).format(format)
  ),
};
