const restify = require('restify');
const fs = require('fs');
const path = require('path');
const cookieParser = require('restify-cookies');

// data store 
const transactions = [];

const server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.jsonBodyParser());
server.use(cookieParser.parse);
/*const corsHandler = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', '*');
    return res.send(204);
  }
};*/
//server.on('MethodNotAllowed', corsHandler);
server.use((req, res, next) => {
  let magicToken = req.cookies['magictoken'];
  if (req.path() === '/api/magiclogin' || !req.path().includes('/api')) {
    return next();
  } else if (!magicToken) {
    res.send(403);
  } else {
    return next();
  }
});

// redirect to reserve up the app if we navigate the browser to /app*
server.get('/app*', (req, res, next) => {
  res.redirect(301, '/', next);
});

// serve up the client app entry point
server.get('/', (req, res, next) => {
  // serve the client app index.html
  let index = fs.readFileSync(path.join(__dirname, 'static/index.html'));
  res.header('Content-Type', 'text/html');
  res.header('Content-Length', index.byteLength);
  res.status = '200';
  res.end(index.toString()); 
});

// get static assets
server.get('/*', restify.plugins.serveStatic({
  directory: './static',
}));

// ;-)
server.get('/api/sup', function (req, res, next) {
  res.send('Yo whaddup?');
});

// loggin in
server.post('/api/magiclogin', (req, res, next) => {
  res.header('Set-Cookie', `magictoken=${Math.random().toString(36) + Math.random().toString(36)}; SameSite=Lax`);
  res.header('Content-Type', 'application/json');
  res.send(200,{
    'status': 'loggedin'
  });
});

// sending dosh
const sendDosh = (recipient, amount) => {
  transactions.push({
    recipient: recipient,
    amount: amount,
    time: (new Date()).toDateString(),
  });
};

server.post('/api/senddosh', (req, res, next) => {
  let body = req.body;
  if (req.header('Content-Type').includes('application/x-www-urlencoded')) {
    let b = body.toString();
    let p = {};
    b.split('&').map((item) => {let v = item.split('='); p[v[0]] = v[1]});
    body = p;
  }
  console.log(body);
  sendDosh(body.recipient, body.amount);
  res.header('Content-Type', 'application/json');
  res.send(200, {
    'status': 'money_sent',
  });
});

server.get('/api/senddosh', (req, res, next) => {
  let query = req.query;
  sendDosh(query.recipient, query.amount);
  res.header('Content-Type', 'application/json');
  res.send(200, {
    'status': 'money_sent',
  });
});

server.get('/api/transactions', (req, res, next) => {
  let cookie = req.cookies['magicToken'];
  res.header('Content-Type', 'application/json');
  res.send(200, {
    transactions: transactions,
  });
});

server.listen(8000, function() {
  console.log('%s listening at %s', server.name, server.url);
});