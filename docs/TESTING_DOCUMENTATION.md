# GRANTLY — Automated Testing & Verification Documentation

**Framework:** Vitest 5.1.0  
**Runner:** Node.js Environment with Path Alias Support (`@/` -> `./src/`)  
**Command:** `npm test` (`vitest run`)  
**Status:** 4 Test Suites, 20 Unit Tests Passing (100% Pass Rate)  

---

## 1. Overview & Test Strategy

To ensure deterministic reliability across the core user journey (**Discover → Understand → Evaluate → Compare → Prepare → Track**), automated unit tests verify the mathematical algorithms, multi-condition rule evaluations, timezone calculations, and document readiness thresholds.

---

## 2. Test Suites Summary

### A. Eligibility Rule Engine (`src/__tests__/eligibility.test.ts`)
* **Test 1**: Verifies `PROFILE_INCOMPLETE` status when profile is null (score = 0%, 0 rules evaluated).
* **Test 2**: Verifies `PROFILE_INCOMPLETE` status when onboarding is not finished.
* **Test 3**: Verifies full `ELIGIBLE` status for qualified undergraduate students meeting all declared criteria.
* **Test 4**: Verifies `NOT_ELIGIBLE` when academic marks/CGPA fall below scholarship threshold.
* **Test 5**: Verifies `NOT_ELIGIBLE` when annual family income exceeds the scholarship ceiling.
* **Test 6**: Verifies gender-specific eligibility enforcement for female-focused programs.
* **Test 7**: Verifies disability reservation criteria (`isDifferentlyAbledOnly`).

### B. Match Scoring Algorithm (`src/__tests__/matchScore.test.ts`)
* **Test 1**: Verifies `totalScore: 0` for null profile without assigning an arbitrary baseline.
* **Test 2**: Verifies `totalScore: 0` when profile onboarding is incomplete.
* **Test 3**: Validates weighted score distribution across education, marks, financial need, and state domicile for high-fit candidates.
* **Test 4**: Verifies that candidates failing mandatory eligibility criteria have their match score capped at maximum 49%.

### C. Deadline Intelligence Engine (`src/__tests__/deadline.test.ts`)
* **Test 1**: Verifies expired scholarships are marked with `isExpired: true` and negative day countdowns.
* **Test 2**: Verifies schemes closing on the same calendar day display `Closes Today` with `critical` urgency.
* **Test 3**: Verifies schemes closing in 24 hours display `Closes Tomorrow`.
* **Test 4**: Verifies schemes closing within 7 days trigger the critical countdown badge.
* **Test 5**: Verifies schemes closing between 8 and 30 days trigger the warning badge.
* **Test 6**: Verifies malformed or missing ISO date strings return safe fallbacks without throwing runtime exceptions.

### D. Application Readiness Gating (`src/__tests__/readiness.test.ts`)
* **Test 1**: Confirms `isReadyToApply: false` when student profile is null.
* **Test 2**: Tracks missing required certificates and accurately calculates uploaded vs total document counts.
* **Test 3**: Enforces strict gating: `isReadyToApply` only turns `true` when profile is complete, all mandatory eligibility rules pass, and 100% of required certificates are verified in the Document Vault.

---

## 3. Running Tests

```bash
# Run all unit tests once
npm test

# Run tests in continuous watch mode during development
npm run test:watch
```

### Execution Output
```
 RUN  v5.1.0 E:/grantly

 ✓ src/__tests__/matchScore.test.ts (4 tests) 68ms
 ✓ src/__tests__/eligibility.test.ts (7 tests) 76ms
 ✓ src/__tests__/readiness.test.ts (3 tests) 88ms
 ✓ src/__tests__/deadline.test.ts (6 tests) 55ms

 Test Files  4 passed (4)
      Tests  20 passed (20)
   Duration  2.73s
```

