const base_url = 'https://canvas.instructure.com/api/v1/';
let token = '';

function print(text) {
  e_output.value += text + '\n';
}

e_input.onkeydown = function(e) {
  if(e.key === 'Enter') {
    let input = e_input.value;
    e_input.value = '';
    print('> ' + input);
    let args = input.split(' ');
    let cmd = args.shift();

    switch(cmd) {
      case 'echo': {
        let text = args.join(' ');
        print(text);
      } break;

      case 'clear':
      case 'cls': {
        e_output.value = '';
      } break;

      default: {
        print('unknown command');
      } break;
    }
  }
}