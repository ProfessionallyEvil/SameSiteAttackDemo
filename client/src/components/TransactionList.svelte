<script>
  import { onMount, afterUpdate } from 'svelte';

  const emojiProgress = '🕵️‍♂️';
  const emojiProgressDone = '📚🧾';

  $: transactions = [];
  onMount(() => {
     /*let res = await api.get('/transactions');
    console.log(res);
    transactions = res.data.transactions;*/
    getTransactions();
  });

  const actuallyGetTransactions = () => {
    //use api to "login"
    api.get('/transactions')
    .then(res => {
      console.log(res);
      transactions = res.data.transactions
      transactions = transactions;
    })
    .catch(err => {
      console.log(err);
    });
  }

  const getTransactions = () => {
    // "progress"
    let progress = document.getElementById('progress');
    progress.innerText = emojiProgress;
    let i = 1;
    const stall = async () => {
      let res = false;
      setTimeout(function () {
        console.log('hi');
        i++;
        if (i < 5) {
          progress.innerText += emojiProgress;
          stall();
        } else if (i === 5) {
          progress.innerText += emojiProgressDone;
          actuallyGetTransactions();
        }
      }, 500);
      return res;
    };
    stall();
  };

  export let api;
</script>

<div>
  {#if transactions.length !== 0}
  <table class='table'>
    <tr>
      <th>Recipient</th>
      <th>Amount</th>
      <th>Date</th>
    </tr>
    {#each transactions as transaction}
      <tr>
        <td>{transaction.recipient}</td>
        <td>{transaction.amount}</td>
        <td>{transaction.time}</td>
      </tr>
    {/each}
  </table>
  {:else if transactions.length === 0}
  <p id='progress'></p>
  {/if}
</div>