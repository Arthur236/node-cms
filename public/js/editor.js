const elements = document.querySelectorAll('.editable');

const editor = new MediumEditor(elements, {
  placeholder: {
    text: 'Type your description',
    hideOnClick: false
  }
});
