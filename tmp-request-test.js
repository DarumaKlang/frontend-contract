const email = `testapi${Date.now()}@example.com`;
const password = 'Password1!';
const registerBody = JSON.stringify({ email, password });
console.log('REGISTER BODY:', registerBody);
const registerRes = await fetch('http://localhost:3000/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: registerBody,
});
console.log('REGISTER STATUS', registerRes.status);
console.log('REGISTER TEXT', await registerRes.text());

const token = 'eyJhbGciOiJFUzI1NiIsImtpZCI6ImUzNGIyYTA5LTYwZjMtNGJkZC1iZjZkLWM1OGYxNTVhNzRlMCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2Joa3d1aGVncHZmYW9wZWhlcnh6LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJlYTk4MzA3My03NGNhLTQxMDctODhjZi01MmQ3OWMzMTYwNmEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzgzMzQ1MTE0LCJpYXQiOjE3ODMzNDE1MTQsImVtYWlsIjoiYXBpdGVzdDE3ODMzNDE0MzAwNTBAZXhhbXBsZS5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc4MzM0MTUxNH1dLCJzZXNzaW9uX2lkIjoiZjUyMWZmNzMtYzI0Yi00Y2U4LTk3NTAtZTZmMWY3NzQ5ZjM0IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.YGbfJtwUeWZFtBod5pfXi8DMsmDlelaKoVIbgbr83nqGlgjTQ5lX1sODiaUL_eOnBoVU1-9rnYkSi_dAS3EmfQ';
const getRes = await fetch('http://localhost:3000/api/profile', {
  headers: { Authorization: `Bearer ${token}` },
});
console.log('GET PROFILE STATUS', getRes.status);
console.log('GET PROFILE TEXT', await getRes.text());

const profileBody = JSON.stringify({ frequent_profile_data: { print_usage: { month: '2026-07', used: 1 } } });
console.log('PROFILE BODY', profileBody);
const postRes = await fetch('http://localhost:3000/api/profile', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: profileBody,
});
console.log('POST PROFILE STATUS', postRes.status);
console.log('POST PROFILE TEXT', await postRes.text());
