async function runTests() {
  const baseUrl = "http://localhost:3000";
  console.log("🚀 Testing Candidate Portal Features...");

  // 1. Log in as Candidate Ethan
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "candidate1@demo.example",
      password: "Demo@12345",
    }),
  });
  const loginJson = await loginRes.json();
  const cookie = loginRes.headers.get("set-cookie") || "";
  console.log(`1. Login Candidate: status=${loginRes.status}, success=${loginJson.success}`);

  const authHeaders = {
    Cookie: cookie,
    "Content-Type": "application/json",
  };

  // 2. GET /api/profile
  const profRes = await fetch(`${baseUrl}/api/profile`, { headers: authHeaders });
  const profJson = await profRes.json();
  console.log(`2. GET /api/profile: status=${profRes.status}, completeness=${profJson.data?.profile?.profileCompleteness}%, hasLatestResume=${!!profJson.data?.latestResume}`);

  // 3. PATCH /api/profile (valid)
  const patchRes = await fetch(`${baseUrl}/api/profile`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify({
      headline: "Staff Backend Architect • Python, Go & Distributed Systems",
      location: "Lahore, Pakistan",
    }),
  });
  const patchJson = await patchRes.json();
  console.log(`3. PATCH /api/profile (valid): status=${patchRes.status}, headline="${patchJson.data?.profile?.headline}"`);

  // 4. PATCH /api/profile (invalid)
  const patchBadRes = await fetch(`${baseUrl}/api/profile`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify({ name: "A" }),
  });
  const patchBadJson = await patchBadRes.json();
  console.log(`4. PATCH /api/profile (invalid name): status=${patchBadRes.status}, code=${patchBadJson.error?.code}`);

  // 5. GET /api/resumes
  const resumesRes = await fetch(`${baseUrl}/api/resumes`, { headers: authHeaders });
  const resumesJson = await resumesRes.json();
  const resumes = resumesJson.data?.resumes || [];
  console.log(`5. GET /api/resumes: status=${resumesRes.status}, count=${resumes.length}`);

  const resumeId = resumes[0]?.id;

  // 6. GET /api/resumes/[id]
  if (resumeId) {
    const rRes = await fetch(`${baseUrl}/api/resumes/${resumeId}`, { headers: authHeaders });
    const rJson = await rRes.json();
    console.log(`6. GET /api/resumes/[id]: status=${rRes.status}, filename="${rJson.data?.resume?.originalFileName}"`);

    // 7. GET /api/resumes/[id]/file
    const fRes = await fetch(`${baseUrl}/api/resumes/${resumeId}/file`, { headers: authHeaders });
    const contentType = fRes.headers.get("content-type");
    console.log(`7. GET /api/resumes/[id]/file: status=${fRes.status}, contentType=${contentType}`);
  }

  // 8. POST /api/resumes (invalid file type)
  const formBad = new FormData();
  formBad.append("file", new Blob(["hello text"], { type: "text/plain" }), "test.txt");
  const uploadBadRes = await fetch(`${baseUrl}/api/resumes`, {
    method: "POST",
    headers: { Cookie: cookie },
    body: formBad,
  });
  const uploadBadJson = await uploadBadRes.json();
  console.log(`8. POST /api/resumes (non-pdf): status=${uploadBadRes.status}, code=${uploadBadJson.error?.code}`);

  // 9. GET /api/applications (as Candidate)
  const appsRes = await fetch(`${baseUrl}/api/applications`, { headers: authHeaders });
  const appsJson = await appsRes.json();
  const myApps = appsJson.data?.applications || [];
  console.log(`9. GET /api/applications (candidate): status=${appsRes.status}, count=${myApps.length}, displayStatus="${myApps[0]?.displayStatus}"`);

  // 10. GET /api/applications/[id] (as Candidate)
  const appId = myApps[0]?.id || "app-ethan-backend";
  const appDetailRes = await fetch(`${baseUrl}/api/applications/${appId}`, { headers: authHeaders });
  const appDetailJson = await appDetailRes.json();
  const appData = appDetailJson.data?.application;
  console.log(`10. GET /api/applications/[id] (candidate): status=${appDetailRes.status}, displayStatus="${appData?.displayStatus}", timelineSteps=${appData?.timeline?.length}, hasRecruiterNotes=${"recruiterNotes" in (appData || {})}`);

  // 11. POST /api/applications (invalid job)
  const appBadRes = await fetch(`${baseUrl}/api/applications`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ jobId: "job-non-existent" }),
  });
  const appBadJson = await appBadRes.json();
  console.log(`11. POST /api/applications (non-existent job): status=${appBadRes.status}, code=${appBadJson.error?.code}`);

  // 12. Check Pages
  const pages = ["/", "/profile", "/applications", `/applications/${appId}`, "/jobs", "/dashboard"];
  console.log("\n📄 Checking Page Status Codes:");
  for (const page of pages) {
    const res = await fetch(`${baseUrl}${page}`, { headers: authHeaders });
    console.log(`- ${page}: ${res.status}`);
  }
}

runTests();
