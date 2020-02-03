<script>
	import { Router, Route, Link, navigate } from 'svelte-routing';
	import { onMount } from 'svelte';
	import Login from './routes/Login.svelte';
	import SendMoney from './routes/SendMoney.svelte';
	import Transactions from './routes/Transactions.svelte';
	import axios from 'axios';
	import FormContainer from './components/FormContainer.svelte';
	import { auth } from './stores/authStore.js';
	import { fly } from 'svelte/transition';

	onMount(() => {
		if (!auth.loggedin) {
			navigate('app/login');
		} else {
			navigate('app/sendmoney');
		}
	});

	let authed;
	auth.subscribe(value => authed = value.loggedin);
	let selectedTabIndex = 0;

	const api = axios.create({
		baseURL: '__apiurl__',
		timeout: 5000,
	});

	const url = ''; 
</script>

<main>
	<Router url='{url}'>
		<div>
			<FormContainer>
				<ul>
					<li class:active={selectedTabIndex === 0}>
						<Link 
							on:click={() => (selectedTabIndex = 0)}
							to='app/login'
						>Login
						</Link>
					</li>
					<li class:active={selectedTabIndex === 1}>
						<Link 
							on:click={() => (selectedTabIndex = 1)}
							to='app/sendmoney'
						>Send Money
						</Link>
					</li>
					<li class:active={selectedTabIndex === 2}>
						<Link 
							on:click={() => (selectedTabIndex = 2)}
							to='app/transactions'
						>Transactions
						</Link>
					</li>
				</ul>
				<Route path='app/sendmoney'>
					<div transition:fly="{{ y:100, duration:500 }}">
						<SendMoney api={api} />
					</div>
				</Route>
				<Route path='app/login'>
					<div transition:fly="{{ y:100, duration:500 }}">
						<Login api={api} />
					</div>
				</Route>
				<Route path='app/transactions'>
					<div transition:fly="{{ y:100, duration:500 }}">
						<Transactions api={api} />
					</div>
				</Route>
			</FormContainer>
		</div>
	</Router>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>