const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
const checked = new Set(); // prevents duplicates

function generateName(length, prefix) {
  let name = prefix;
  while (name.length < length) {
    name += chars[Math.floor(Math.random() * chars.length)];
  }
  return name;
}

async function checkUsername(username) {
  const res = await fetch(`https://api.github.com/users/${username}`);
  return res.status === 404;
}

function copyText(text) {
  navigator.clipboard.writeText(text);
  alert("Copied: " + text);
}

function visitProfile(username) {
  window.open(`https://github.com/${username}`, "_blank");
}

async function startFinding() {
  const length = parseInt(document.getElementById("length").value);
  const prefix = document.getElementById("prefix").value.toLowerCase();
  const results = document.getElementById("results");

  results.innerHTML = "";
  checked.clear();

  if (!length) {
    alert("Please enter username length");
    return;
  }

  let found = 0;
  let attempts = 0;

  while (found < 10 && attempts < 200) {
    attempts++;

    const username = generateName(length, prefix);

    if (checked.has(username)) continue;
    checked.add(username);

    try {
      const available = await checkUsername(username);

      if (available) {
        const li = document.createElement("li");

        li.innerHTML = `
          <span>${username}</span>
          <div class="icons">
            <span onclick="copyText('${username}')">📋</span>
            <span onclick="visitProfile('${username}')">🔗</span>
          </div>
        `;

        results.appendChild(li);
        found++;
      }

      await new Promise(r => setTimeout(r, 700));

    } catch (err) {
      console.log("Error");
    }
  }
}
