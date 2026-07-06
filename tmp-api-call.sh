curl -i -X GET http://localhost:3000/api/profile -H "Authorization: Bearer $token"

curl -i -X POST http://localhost:3000/api/profile -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d '$body'
