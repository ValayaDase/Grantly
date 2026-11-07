# GRANTLY — User Guide

GRANTLY is a browser-side prototype for exploring scholarship records and tracking application preparation.

> **Demo limits:** The 18 scholarship records and Priya Sharma profile are seeded examples, not a live verified catalog. Login is simulated. The app does not submit applications or receive provider status updates. The Document Vault saves metadata only; file contents are not retained. Eligibility checks are preliminary. Verify current rules and deadlines with the scholarship provider, and do not store sensitive identity information in this prototype.

## Start the app

From the repository root, run `npm install` and `npm run dev`, then open `http://localhost:3000`. The landing page links to scholarship discovery and the login/signup demo flows. The demo profile is available immediately through the demo login option.

## Set up a student profile

Use **Sign Up** or **Onboarding** to enter personal, education, academic, income, category, and preference information. These details are saved in this browser's localStorage. Update them from **My Profile**. Profile fields are student-declared and are not verified by GRANTLY.

## Discover and filter records

Open **Discover Scholarships** (`/scholarships`) to search the local sample catalog. Search covers scholarship title, provider, category, description, courses, and tags. Available filters include education level, category, provider type, state, gender, award range, income ceiling, and eligibility. Sorting options include recommended, deadline, amount, and recently added.

The recommended order uses the profile match heuristic, eligibility status, and deadline tie-break. Known-ineligible records are excluded from the recommendation feed. Without a completed profile, match scores are not personalized; complete the profile first.

## Read match and eligibility results

The profile match is a deterministic heuristic, not AI and not a probability of receiving funding. It compares recorded education, academic marks, income, category/gender, and domicile dimensions. Failed mandatory eligibility criteria cap the total score at 49. Reasons explain recorded matches and mismatches.

Scholarship detail pages show the criteria present in the sample record and a preliminary eligibility status:

- **Eligible** means the profile satisfies the mandatory criteria recorded in that sample record.
- **Potentially Eligible** means a required profile detail is missing.
- **Not Eligible** means one or more recorded mandatory criteria fail.
- **Profile Incomplete** means the profile is not ready to evaluate.

These labels do not guarantee that the current official program will accept an application. Check the provider's rules and date before acting.

## Compare and save scholarships

Use the compare control on a scholarship card to add it to the comparison set. Up to three records can be compared at once. The comparison view includes amount, provider, recorded requirements, deadline, documents, and profile match when a completed profile exists.

Use the bookmark control to save an opportunity, then open **Saved Scholarships** (`/saved`) to review it. Saved IDs persist in localStorage for this browser.

## Prepare document records

The **Document Vault** (`/documents`) lets you create a record for a document type and captures file metadata such as name, size, and MIME type. The selected file itself is not saved by this prototype, and new records start as unverified. The readiness checklist compares required document types against records in the vault.

The checklist score is not an approval or guarantee. “Ready to Apply” is shown only when the profile is complete, recorded mandatory eligibility criteria pass, and all required document types are represented. Confirm provider-specific documents and requirements yourself.

## Track applications

Add an opportunity to the application pipeline from its detail or card actions. Set a status, record personal notes and an acknowledgement number, and update the status as you manage the process. The tracker is local to this browser and is not synchronized with scholarship portals. An “Applied” status is your own record; it does not submit a form.

## Deadlines and notifications

Deadline labels are calculated from the current calendar date in India and the date stored in each sample record. The records are not updated from provider sources. Notifications are created by demo actions and seeded data; the app does not deliver automatic SMS/email reminders or obtain deadline updates.

## Data and reset

Profile, login flag, saved IDs, applications, document metadata, and notifications are stored in browser localStorage under the `grantly_v1_` prefix. This is editable by the browser user and is not secure authentication or encrypted document storage. **Settings → Reset to Demo Data** resets GRANTLY's own prefixed keys to the starter sample. Clearing browser site data removes the local state.

## What is not available

- Production account creation, password verification, route authorization, or account recovery.
- A scholarship database, currentness verification, or provider API integration.
- Binary document storage, certificate validation, or secure private file handling.
- Online application submission or provider-side status synchronization.
- Automatic external deadline notifications.
