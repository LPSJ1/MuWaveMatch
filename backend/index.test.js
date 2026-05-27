const test = require("node:test");
const assert = require("node:assert/strict");
const { findMatches, discoverEvents } = require("./index");

test("findMatches returns ranked users by shared interests", () => {
  const matches = findMatches(["rnb", "afrobeats"]);

  assert.equal(matches[0].name, "Aria");
  assert.equal(matches[0].score, 2);
  assert.deepEqual(matches[0].sharedInterests, ["afrobeats", "rnb"]);
  assert.ok(matches.every((match) => match.score > 0));
});

test("discoverEvents filters by city and interests", () => {
  const discovered = discoverEvents({ interests: ["indie", "jazz"], city: "toronto" });

  assert.equal(discovered.length, 1);
  assert.equal(discovered[0].name, "Indie City Fest");
});

test("discoverEvents returns all events when no filters are provided", () => {
  const discovered = discoverEvents();

  assert.ok(discovered.length >= 5);
});
