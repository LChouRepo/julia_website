const fs = require("fs");
const path = require("path");

const CONTENT_DIR = path.join(process.cwd(), "content");

const toObj = (v) => {
  if (v == null) return v;
  if (typeof v === "object") return v;      // already {en,de} or object
  if (typeof v === "string") return { en: v, de: "" };
  return v;
};

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function writeJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function migrateSettings() {
  const p = path.join(CONTENT_DIR, "settings.json");
  if (!fs.existsSync(p)) return;
  const j = readJson(p);
  j.siteTitle = toObj(j.siteTitle);
  j.tagline = toObj(j.tagline);
  j.homeHello = toObj(j.homeHello);
  writeJson(p, j);
  console.log("✓ migrated settings.json");
}

function migrateAbout() {
  const p = path.join(CONTENT_DIR, "about.json");
  if (!fs.existsSync(p)) return;
  const j = readJson(p);
  j.bioShort = toObj(j.bioShort);
  j.bioLong = toObj(j.bioLong);
  writeJson(p, j);
  console.log("✓ migrated about.json");
}

function migrateFolder(folder, fns) {
  const dir = path.join(CONTENT_DIR, folder);
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const p = path.join(dir, file);
    const j = readJson(p);
    fns(j);
    writeJson(p, j);
    console.log("✓ migrated", folder, file);
  }
}

migrateSettings();
migrateAbout();

migrateFolder("events", (j) => {
  j.title = toObj(j.title);
  j.venue = toObj(j.venue);
});

migrateFolder("releases", (j) => {
  j.title = toObj(j.title);
  j.subtitle = toObj(j.subtitle);
  if (Array.isArray(j.links)) {
    j.links = j.links.map((l) => ({ ...l, label: toObj(l.label) }));
  }
});

migrateFolder("quotes", (j) => {
  j.text = toObj(j.text);
});

migrateFolder("gallery", (j) => {
  j.title = toObj(j.title);
});

console.log("\nDone. Now commit and push your updated content/*.json files.");
