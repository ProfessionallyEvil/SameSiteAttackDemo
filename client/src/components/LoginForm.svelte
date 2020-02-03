<script>
  import { auth } from '../stores/authStore.js';
  import { navigate } from 'svelte-routing';

  const emojiProgress = '✨';
  const emojiProgressDone = '🦄';
  let actuallyLoginNow = false;

  const actuallyDoLogin = () => {
    let button = document.getElementById('magicButton');
    console.log(button);
    button.innerText = emojiProgressDone;
    //use api to "login"
    api.post('/magiclogin', {
      loginMode: 'magic',
    })
    .then(res => {
      console.log(res);
      if (res && res.data.status === 'loggedin') {
        auth.set({
          loggedin: true
        });
        navigate('sendmoney');
      } else {
        auth.set({
          loggedin: false
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  const doLogin = () => {
    // "progress"
    let button = document.getElementById('magicButton');
    button.innerText = emojiProgress;
    let i = 1;
    const stall = async () => {
      let res = false;
      setTimeout(function () {
        console.log('hi');
        i++;
        if (i < 5) {
          button.innerText += emojiProgress;
          stall();
        } else if (i === 5) {
          button.innerText += emojiProgressDone;
          actuallyDoLogin();
        }
      }, 500);
      return res;
    };
    stall();
  };

  export let api;
</script>

<button 
  id='magicButton'
  on:click|preventDefault={doLogin} 
  type='button'
>
Click me to log in with magic™ 🌈🦄✨
</button>