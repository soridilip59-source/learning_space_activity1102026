TEAM 3 — API TESTING CHECKLIST

Start:
npm install
npm run dev

Base URL:
http://localhost:5000

TEST 1 — Health
GET /api/health
Expected: success true

TEST 2 — Get all
GET /api/complaints
Expected:
success true
count number
data array

TEST 3 — Search
GET /api/complaints?search=wifi

TEST 4 — Filter
GET /api/complaints?status=Pending

TEST 5 — Create
POST /api/complaints
JSON:
{
  "studentName": "Karan",
  "studentId": "ST-999",
  "category": "Internet",
  "title": "WiFi is slow in room 3",
  "description": "Internet speed drops every afternoon.",
  "priority": "High",
  "location": "Room 3"
}

TEST 6 — Update
PUT /api/complaints/CC-1001/status
JSON:
{
  "status": "In Progress"
}

TEST 7 — Delete
DELETE /api/complaints/CC-1001

TEST 8 — Invalid route
GET /api/unknown
Expected: 404 JSON response

TEST 9 — Invalid status
PUT /api/complaints/CC-1002/status
{
  "status": "Completed"
}
Expected: 400

TEST 10 — Missing fields
POST /api/complaints
{
  "title": "Broken"
}
Expected: 400 with validation errors
