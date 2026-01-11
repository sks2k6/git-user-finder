const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
let collected = [];
const checked = new Set();

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

function exportResults() {
  if (collected.length === 0) {
    alert("No results to export");
    return;
  }

  const blob = new Blob([collected.join("\n")], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "available-usernames.txt";
  link.click();
}

async function startFinding() {
  const length = parseInt(document.getElementById("length").value);
  const prefix = document.getElementById("prefix").value.toLowerCase();
  const results = document.getElementById("results");
  const progress = document.getElementById("progress");
  const status = document.getElementById("status");

  results.innerHTML = "";
  progress.style.width = "0%";
  status.textContent = "Working...";
  collected = [];
  checked.clear();

  if (!length || length < 1) {
    alert("Enter valid length");
    return;
  }

  if (prefix.length > length) {
    alert("Prefix length cannot be greater than total length");
    return;
  }

  let attempts = 0;
  const maxAttempts = 150;
  const targetFind = 10;

  while (attempts < maxAttempts && collected.length < targetFind) {
    attempts++;

    const username = generateName(length, prefix);
    if (checked.has(username)) continue;
    checked.add(username);

    try {
      const available = await checkUsername(username);

      if (available) {
        collected.push(username);

        const li = document.createElement("li");
        li.innerHTML = `
          <span>${username}</span>
          <div class="icons">
            <span onclick="copyText('${username}')">📋</span>
            <span onclick="visitProfile('${username}')">🔗</span>
          </div>
        `;
        results.appendChild(li);
      }

      progress.style.width = `${(attempts / maxAttempts) * 100}%`;
      status.textContent = `Checked: ${attempts} | Found: ${collected.length}`;

      await new Promise(r => setTimeout(r, 500));

    } catch (err) {
      console.log("API error");
    }
  }

  status.textContent = `Finished. Found ${collected.length} usernames.`;
}
