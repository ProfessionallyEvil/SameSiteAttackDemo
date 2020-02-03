<script>
  import { navigate } from 'svelte-routing';

  const emojiProgress = '💸';
  const emojiProgressDone = '🤑';
  let amount;
  let recipient;

  const actuallySendMoney = () => {
    let button = document.getElementById('moneyButton');
    console.log(button);
    button.innerText = emojiProgressDone;
    //use api to "login"
    api.post('/senddosh', {
      amount: amount,
      recipient: recipient,
    })
    .then(res => {
      console.log(res);
      if (res && res.data.status === 'money_sent') {
        // navigate to /transactions
        navigate('transactions');
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  const sendMoney = () => {
    // "progress"
    let button = document.getElementById('moneyButton');
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
          actuallySendMoney();
        }
      }, 500);
      return res;
    };
    stall();
  }; 

  export let api;
</script>

<style></style>

<div>
  <form on:submit|preventDefault={sendMoney} class="login-form">
    <input bind:value={recipient} type="email" placeholder="recipient@muney.dosh"/>
    <input bind:value={amount} type="number" placeholder="$1000"/>
    <button id='moneyButton'>💰 Payola 💰</button>
  </form>
</div>