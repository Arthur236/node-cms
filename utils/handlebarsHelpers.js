const moment = require('moment');

module.exports = {
  select: (selected, options) => {
    return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$&selected="selected"');
  },

  formatDate: (date, format='MM-DD-YYY') => {
    return moment(date).format(format);
  }
};
