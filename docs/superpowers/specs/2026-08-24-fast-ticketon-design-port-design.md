# Design port: fast-ticketon-form → origination-form

## Goal
Make the origination form (5-step wizard, CRA + Tailwind Play CDN) look like the
fast-ticketon-form main page (`/fast-ticketon-form`, `ApplicationShell` design).
Visual only — no change to steps, validation, data flow, or submission.

Note: fast-ticketon-form also contains `FormShell`, which is a copy of the
origination form's *current* design. The target is the newer `ApplicationShell`
design, not `FormShell`.

## Design tokens (source: fast-ticketon-form components)
- Page: bg `#fbfbfc`, text `#1f2a37`, font Libre Franklin (already in place)
- Headings: `#161b22`, extrabold, tracking-tight; hero 40px centered
- Muted text: `#6b7280` (labels), `#9aa3af` (hints), `#5b6573` (body)
- Borders: inputs `#dfe3e8`, dividers `#eef0f3`
- Accent orange: `#ef6b2f` (required *, links, checkbox accent)
- CTA gradient: `#f78fa7 → #fbbf7a`, pill (rounded-full), white bold text,
  shadow `0 8px 22px rgba(247,143,167,0.4)`; disabled: `#f9c3cf → #fcdcae`
- Secondary button: white pill, border `#dfe3e8`
- Header bar gradient: 3px, `#f8d36b → #f4a0a8`
- Inputs: `rounded-[14px]`, border `#dfe3e8`, `px-[18px] py-3.5`, text-base,
  placeholder `#aab1bb`, focus `border-violet-500` + `ring-[3px] ring-violet-500/10`
- Labels: `text-sm text-[#6b7280] mb-[7px] ml-1`, required star `#ef6b2f`
- Upload dropzone: `rounded-2xl border-[1.5px] dashed #cfd5dd bg-[#f7f8fa]`
- Success green: `#1f8a4c`

## Changes (origination-form)
1. `src/index.css` — body bg `#fbfbfc`, color `#1f2a37`
2. `MultiStepForm.tsx` — replace narrow `lg:w-[30%]` white column with
   ApplicationShell chrome: sticky header (logo h-10 + partner logo) over a 3px
   gradient bar, `max-w-[760px] px-7` content column, hero-style step title.
   Progress bar kept (it exists in both projects), slimmed to match.
3. `StepTitle.tsx` — SectionHeading typography (`text-2xl font-extrabold
   tracking-tight text-[#1f2a37]`)
4. Field components (`TextField`, `DropdownField`, `TextAreaField`,
   `PhoneField`, `AddressAutocomplete`) — target input + label styles above.
   `CurrencyField`/`NumberField`/`DatePickerField` wrap `TextField` → free.
5. `ButtonPrimary`/`ButtonSecondary` — fast-ticketon `Button` variants.
6. `FileUploadField` — dropzone restyled to dashed `#cfd5dd` on `#f7f8fa`.
7. `Switch` — checked track recolored to the rose/amber CTA gradient.
8. Light consistency pass: `PasswordProtection` input, checkbox/radio accents
   `accent-[#ef6b2f]`.

## Out of scope
Step layout/content, SummaryStep cards, LoadingScreen animation, SubmitSuccess
(already close to target language), validation logic, submission payloads.

## Verification
`npx tsc --noEmit` (or CRA build) + visual check of all 5 steps in the browser.
