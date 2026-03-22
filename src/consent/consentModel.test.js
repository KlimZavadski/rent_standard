import test from "node:test";
import assert from "node:assert/strict";
import {
  acceptAllConsent,
  buildConsent,
  defaultCategories,
  hasConsentFor,
  parseConsentRecord,
  rejectNonEssentialConsent,
  shouldRepromptBanner,
} from "./consentModel.js";
import { CONSENT_POLICY_VERSION, CONSENT_SCHEMA_VERSION } from "./consentConstants.js";

test("defaultCategories only necessary is true, optional off", () => {
  const c = defaultCategories();
  assert.equal(c.necessary, true);
  assert.equal(c.analytics, false);
  assert.equal(c.marketing, false);
});

test("acceptAllConsent sets analytics and marketing", () => {
  const r = acceptAllConsent("banner");
  assert.equal(r.categories.analytics, true);
  assert.equal(r.categories.marketing, true);
  assert.equal(r.schemaVersion, CONSENT_SCHEMA_VERSION);
  assert.equal(r.policyVersion, CONSENT_POLICY_VERSION);
});

test("rejectNonEssentialConsent clears optional", () => {
  const r = rejectNonEssentialConsent("banner");
  assert.equal(r.categories.analytics, false);
  assert.equal(r.categories.marketing, false);
});

test("buildConsent sanitizes categories", () => {
  const r = buildConsent({
    source: "preferences",
    categories: { necessary: true, analytics: 1, marketing: 0 },
  });
  assert.equal(r.categories.analytics, true);
  assert.equal(r.categories.marketing, false);
});

test("hasConsentFor", () => {
  assert.equal(hasConsentFor(null, "necessary"), true);
  assert.equal(hasConsentFor(null, "analytics"), false);
  const r = acceptAllConsent("banner");
  assert.equal(hasConsentFor(r, "marketing"), true);
});

test("parseConsentRecord rejects invalid", () => {
  assert.equal(parseConsentRecord(null), null);
  assert.equal(parseConsentRecord({}), null);
  assert.equal(parseConsentRecord({ categories: { necessary: false } }), null);
});

test("parseConsentRecord ignores legacy preferences field in storage", () => {
  const r = parseConsentRecord({
    schemaVersion: 1,
    policyVersion: 1,
    region: "PL",
    timestamp: "2020-01-01T00:00:00.000Z",
    source: "banner",
    categories: {
      necessary: true,
      preferences: true,
      analytics: false,
      marketing: true,
    },
  });
  assert.ok(r);
  assert.equal(r.categories.analytics, false);
  assert.equal(r.categories.marketing, true);
  assert.equal("preferences" in r.categories, false);
});

test("shouldRepromptBanner on version mismatch", () => {
  const r = acceptAllConsent("banner");
  assert.equal(shouldRepromptBanner(r), false);
  assert.equal(shouldRepromptBanner(null), true);
});
