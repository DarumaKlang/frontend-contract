import fetch from 'node-fetch';
const email = `testapi${Date.now()}@example.com`;
const body = JSON.stringify({ email, password: 'Password1!' });
console.log('EMAIL', email);
const res = await fetch('http://localhost:3000/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
console.log('STATUS', res.status);
const text = await res.text();
console.log('BODY', text);
