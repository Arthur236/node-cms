const moment = require('moment');

module.exports = {
  select: (selected, options) => (
    options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$&selected="selected"')
  ),

  formatDate: (date, format = 'MM-DD-YYY') => (
    moment(date).format(format)
  ),

  paginate: (options) => {
    let output = '';

    if (options.hash.current === 1) {
      output += `<li class="page-item disabled"><a class="page-link" href="#">First</a></li>`;
    } else {
      output += `<li class="page-item"><a class="page-link" href="?page=1">First</a></li>`;
    }

    let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1);

    if (i !== 1) {
      output += `<li class="page-item disabled"><a class="page-link" href="#">...</a></li>`;
    }

    for (; i <= (Number(options.hash.current) + 4) && i <= options.hash.pages; i++) {
      if (i === options.hash.current) {
        output += `<li class="page-item active"><a class="page-link" href="#">${i}</a></li>`;
      } else {
        output += `<li class="page-item"><a class="page-link" href="?page=${i}">${i}</a></li>`;
      }

      if (i === Number(options.hash.current) + 4 && i < options.hash.pages) {
        output += `<li class="page-item disabled"><a class="page-link" href="#">...</a></li>`;
      }
    }

    if (options.hash.current === options.hash.pages) {
      output += `<li class="page-item disabled"><a class="page-link" href="#">Last</a></li>`;
    } else {
      output += `<li class="page-item"><a class="page-link" href="?page=${options.hash.pages}">Last</a></li>`;
    }

    return output;
  },

  compare: (lvalue, operator, rvalue, options) => {

    let operators, result;

    if (arguments.length < 3) {
      throw new Error("Handlebars helper 'compare' needs 2 parameters");
    }

    if (options === undefined) {
      options = rvalue;
      rvalue = operator;
      operator = "===";
    }

    operators = {
      '==': function(l, r) {
        return l == r;
      },
      '===': function(l, r) {
        return l === r;
      },
      '!=': function(l, r) {
        return l != r;
      },
      '!==': function(l, r) {
        return l !== r;
      },
      '<': function(l, r) {
        return l < r;
      },
      '>': function(l, r) {
        return l > r;
      },
      '<=': function(l, r) {
        return l <= r;
      },
      '>=': function(l, r) {
        return l >= r;
      },
      'typeof': function(l, r) {
        return typeof l === r;
      }
    };

    if (!operators[operator]) {
      throw new Error("Handlebars helper 'compare' doesn't know the operator " + operator);
    }

    result = operators[operator](lvalue, rvalue);

    if (result) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  }
};
