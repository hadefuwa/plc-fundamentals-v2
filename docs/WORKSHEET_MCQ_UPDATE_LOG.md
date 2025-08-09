# Worksheet MCQ Update Log

Purpose: Track changes made to the Multiple Choice Questions (MCQs) across worksheets to align with the course answers, hide simulations after Q&A, and distribute correct options fairly across A–D.

Source of truth for questions/answers: `docs/CP2388 – PLC Fundamentals for Maintenance Engineers - Answers.txt`

## Completed work

- Aligned Questions & Answers sections to match the answers document (worksheets 2–12; 1 left unchanged).
- Fixed answer checking to reliably read the correct letter from the visible “Correct Answer:” text using regex: `^([A-D])\)`.
- Commented out the interactive simulation sections that come after “Questions & Answers” so they are hidden but preserved for future use.
  - Applied on: `worksheet-3.html`, `worksheet-5.html`, `worksheet-6.html`, `worksheet-7.html`, `worksheet-8.html`, `worksheet-9.html`, `worksheet-10.html`, `worksheet-11.html`, `worksheet-12.html`.

## Correct answer redistribution (in progress)

Goal: Ensure the correct option letters A–D are well distributed within each worksheet while keeping the same correct statement.

Notes:
- For worksheets that parse the letter from the visible “Correct Answer:” line, changing that letter is sufficient.
- For worksheets that use an internal `correctAnswers` object (e.g., 10–12), we will also update that object so the checker matches the new letters.

### Changes applied so far

- Worksheet 3 – HMI Basics
  - Q3 correct moved to B
  - Q4 correct moved to D
  - Q5 correct moved to B
  - Distribution now: A:1, B:2, C:1, D:1

- Worksheet 4 – Emergency Stops
  - Q3 correct moved to B
  - Q4 correct moved to D
  - Q5 correct moved to C
  - Distribution now: A:1, B:1, C:2, D:1

- Worksheet 5 – Status LED
  - Q2 correct set to A
  - Q4 correct moved to C (text relocated accordingly)
  - Q5 correct moved to B
  - Current distribution: A:3, B:1, C:1, D:0 (to rebalance)

- Worksheet 6 – NO vs NC
  - Q2 correct moved to C
  - Q3 correct moved to B
  - Q4 correct moved to D
  - Distribution now: A:2, B:1, C:1, D:1

- Worksheet 7 – Proximity Switch
  - Q2 correct moved to D
  - Q4 correct moved to D (text relocated)
  - Q5 correct moved to B
  - Current distribution: A:1, B:2, C:0, D:2 (to add at least one C)

### Pending

- Rebalance Worksheet 5 (reduce A, add D).
- Rebalance Worksheet 7 (introduce a C).
- Redistribute and verify Worksheets 8–12.
  - Important: Update `correctAnswers` objects in `worksheet-10.html`, `worksheet-11.html`, and `worksheet-12.html` to match any new letters.

## Implementation details (simple checklist)

1) Open the worksheet file.
2) In each affected question:
   - Move the correct statement text to the target option letter (A–D).
   - Update the visible “Correct Answer:” line to the same new letter.
3) If the file uses a `correctAnswers` object for checking, update that mapping too.
4) Save and test each question by selecting different options.

## Verification

- Use the on‑page Submit Answer buttons to ensure:
  - Correct answers show as green; incorrect selections show red and reveal the correct answer.
  - Distribution across A–D looks balanced per worksheet (aim: no clustering).

## Next run plan

- Finalise redistribution on 5 and 7, then complete 8–12.
- For 10–12, keep the mapping object and the visible letter perfectly in sync.


