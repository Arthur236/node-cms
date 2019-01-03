/* eslint-disable */
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: [
      'bold',
      'italic',
      'underline',
      'anchor',
      'h2',
      'h3',
      'quote',
      'removeFormat',
      'html'
    ]
  },
  placeholder: {
    text: 'Type your description',
    hideOnClick: false
  },
  forcePlainText: false,
  autoLink: true,
  extensions: {
    'imageDragging': {}
  }
});

const nonEditableEditor = new MediumEditor('.editor', {
  disableEditing: true,
  toolbar: false,
  placeholder: false,
  forcePlainText: false,
  autoLink: true,
  extensions: {
    'imageDragging': {}
  }
});
