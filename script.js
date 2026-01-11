const chars = "abcdefghijklmnopqrstuvwxyz0123456789";

function generateName(length, prefix) {
  let name = prefix;
  while (name.length < length) {
    name += chars[Math.floor(Math.random() * chars.length)];
  }
  return name;
}

async function checkUsername(username) {
  const res = await fetch(`https://api.github.com/users/${username}`);
  return res.status === 404; // 404 = available
}

async function startFinding() {
  const length = parseInt(document.getElementById("length").value);
  const prefix = document.getElementById("prefix").value.toLowerCase();
  const results = document.getElementById("results");

  results.innerHTML = "";

  if (!length) {
    alert("Please enter username length");
    return;
  }

  let found = 0;
  let attempts = 0;

  while (found < 10 && attempts < 100) {
    attempts++;

    const username = generateName(length, prefix);

    try {
      const available = await checkUsername(username);

      if (available) {
        const li = document.createElement("li");
        li.textContent = username;
        results.appendChild(li);
        found++;
      }

      await new Promise(r => setTimeout(r, 800)); // delay (avoid GitHub rate limit)

    } catch (err) {
      console.log("Error checking username");
    }
  }
}
