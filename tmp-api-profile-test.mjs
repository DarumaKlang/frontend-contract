const token = "' + $token + '";
console.log("GET profile");
const getRes = await fetch("http://localhost:3000/api/profile", {
  headers: { Authorization: `Bearer ${token}` },
});
console.log("GET status", getRes.status);
console.log(await getRes.text());
console.log("POST profile");
const body = { frequent_profile_data: { print_usage: { month: "2026-07", used: 1 } } };
const postRes = await fetch("http://localhost:3000/api/profile", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
console.log("POST status", postRes.status);
console.log(await postRes.text());
