const base_url = 'https://canvas.instructure.com/api/v1/';
let cmds = {};
let token = '';

function register(name, run, usage = '', desc = '') {
  if(typeof name !== 'string' || typeof run !== 'function') {
    return false;
  }

  if(typeof cmds[name] === 'undefined') {
    cmds[name] = {
      name,
      type: 'command',
      run,
      usage,
      desc
    };
    return true;
  } else {
    return false;
  }
}

function alias(name, run) {
  if(typeof name !== 'string' || typeof run !== 'string') {
    return false;
  }

  if(typeof cmds[name] === 'undefined') {
    cmds[name] = {
      name,
      type: 'alias',
      run
    };
    return true;
  } else {
    return false;
  }
}

function unregister(name) {
  if(typeof name !== 'string') {
    return false;
  }

  if(typeof cmds[name] !== 'undefined') {
    delete cmds[name];
    return true;
  } else {
    return false;
  }
}

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

    if(typeof cmds[cmd] !== 'undefined') {
      if(cmds[cmd].type === 'command') {
        cmds[cmd].run(args);
      } else if(cmds[cmd].type === 'alias') {
        cmds[cmds[cmd].run].run(args);
      } else {
        print('invalid command type');
      }
    } else {
      print('unknown command, use help for a list');
    }
  }
}

register('help', function(args) {
  if(args[0]) {
    if(typeof cmds[args[0]] !== 'undefined') {
      if(cmds[args[0]].type === 'command') {
        let cmd = cmds[args[0]];
        print(cmd.name);
        print('usage: ' + cmd.name + ' ' + cmd.usage);
        print(cmd.desc);
      } else if(cmds[args[0]].type === 'alias') {
        let cmd = cmds[cmds[args[0]].run];
        print(cmd.name);
        print('usage: ' + cmd.name + ' ' + cmd.usage);
        print(cmd.desc);
      } else {
        print('invalid command type');
      }
    }
  } else {
    let mappings = {};
    for(let cmd in cmds) {
      if(cmds[cmd].type === 'command') {
        mappings[cmd] = cmd;
      } else if(cmds[cmd].type === 'alias') {
        mappings[cmds[cmd].run] += ' | ' + cmd;
      }
    }
    for(let i in mappings) {
      print(mappings[i]);
    }
  }
}, '[command]', 'lists commands or gives info on a specified command');

register('echo', function(args) {
  let text = args.join(' ');
  print(text);
}, '<text...>', 'echoes back given text');
alias('print', 'echo');

register('clear', function(args) {
  e_output.value = '';
}, '', 'clears the output');
alias('cls', 'clear');