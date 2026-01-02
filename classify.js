const DEFAULT_RULES = [
  { domain: "github.com", category: "coding", productive: true },
  { domain: "stackoverflow.com", category: "coding", productive: true },
  { domain: "leetcode.com", category: "coding", productive: true },
  { domain: "docs.google.com", category: "work", productive: true },
  { domain: "youtube.com", category: "social", productive: false },
  { domain: "instagram.com", category: "social", productive: false },
  { domain: "facebook.com", category: "social", productive: false },
  { domain: "twitter.com", category: "social", productive: false },
  { domain: "reddit.com", category: "social", productive: false }
];
function matchDomain(domain, rules) {
  const exact = rules.find(r => r.domain === domain);
  if (exact) return exact;
  const parts = domain.split(".").reverse();
  const base = parts[1] + "." + parts[0];
  return rules.find(r => r.domain === base) || null;
}
function classify(domain, userRules = []) {
  const rules = [...userRules, ...DEFAULT_RULES];
  const rule = matchDomain(domain, rules);
  if (rule) return { productive: rule.productive, category: rule.category };
  return { productive: false, category: "unknown" };
}
module.exports = { classify };
