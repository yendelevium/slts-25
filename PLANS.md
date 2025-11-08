# How to make a 10-step form easy joyful to fill ?

1. Break down the form into logical sections. Try to reduce if possible
    - Use the "wizard" pattern
    - Add a fun element (similar to mobile app onboarding workflow)
2. Show a progress bar or step indicator for clear progression tracking
    - Display step numbers with current steps highlighted
    - Give steps different weights so that progress bar fills out at different 
    rate
3. Save user progress automatically for each section
    - Persist form state locally
    - Use debounce to minimize frequent writes (not every keystroke)
    - Provide a visual cue "Progress saved"
    - On page reload, restore saved state
4. Use clear, concise labels, placeholders and tooltips for guidance
    - Use placeholders as examples
    - Add tooltips for web users registering (optional)
5. Provide inline validation and immediate feedback on inputs to reduce errors
    - Validate a section before going to next section
    - Validate after delay in typing and not altogether
6. Enable auto-focus on next input fields for faster input
    - Target the "Enter" keyword to jump to next form field with React.useRef
7. Add subtle animations and micro-interactions for smooth experience
    - Fade or slide or scale effects between steps
    - Animated success / loading / failed buttons
    - Use subtle loading indicators for async validation
    - Show offline mode
8. Optimize the form UI for mobile device especially to ensure accessibility
    - Use touch targets with sufficient space for mobile devices
    - Avoid horizontal scrolling
    - Target mobile and tablet screen-sizes mainly

# Flow

`Create progress bar for entire form`
https://ui.shadcn.com/docs/components/pagination
https://ui.shadcn.com/docs/components/progress

### Section 1: Student Info

`field`
- Group: 
    `Check only for 3`
- Have u given group 2 exam ?
    `Conditional`

`field`
- Name: https://ui.shadcn.com/docs/components/input-group
- DOB: https://ui.shadcn.com/docs/components/calendar
- Gender: https://ui.shadcn.com/docs/components/button-group
- District: https://ui.shadcn.com/docs/components/select 
- Samithi: https://ui.shadcn.com/docs/components/input-group

`field`
- Year of Joining Balvikas (mandatory): https://ui.shadcn.com/docs/components/select
- Date of Joining Balvikas (option): https://ui.shadcn.com/docs/components/calendar
- Food Allergies: https://ui.shadcn.com/docs/components/input-group

### Section 2: Contestant Info

`cut events based on gender`
`cut events based on date of joining`
`cut events based on age`

- Group 1:
    - Devotional Singing : https://ui.shadcn.com/docs/components/radio-group
        `YES | NO` | `render horizontally`
    - Individual Event Choice 1: https://ui.shadcn.com/docs/components/radio-group
        `To view all events at once` | `render vertically`
    - Individual Event Choice 2: https://ui.shadcn.com/docs/components/radio-group
        `To view all events at once` | `show if NO if devo.singing` | `render vertically`

    > Throw sonner to highlight only one choice in individual events
    https://ui.shadcn.com/docs/components/sonner

- Group 2 and 3:
    - Have you passed group 2 exam ?: https://ui.shadcn.com/docs/components/radio-group
        `YES | NO`
    - Show the Note (rules): https://ui.shadcn.com/docs/components/item 
        `Get acknowledgement` | `Use drawer to revisit` | https://ui.shadcn.com/docs/components/drawer
    - Do you want to participate in quiz ?: https://ui.shadcn.com/docs/components/radio-group
        `YES | NO` | `render horizontally`
    - If no Quiz :
        - Do you want to participate in Group Event ?: https://ui.shadcn.com/docs/components/radio-group
            `MCQ + I don't wanna participate`
        - If no Group:
            - Individual Event Choice 1: https://ui.shadcn.com/docs/components/radio-group
                `To view all events at once` | `if !bhajan <=> !tamizh-chants` | `render vertically`
            - Individual Event Choice 2: https://ui.shadcn.com/docs/components/radio-group
                `To view all events at once` | `if !bhajan <=> !tamizh-chants` | `render vertically`
        - If Group:
            - Individual Event Choice 1: https://ui.shadcn.com/docs/components/radio-group
                `To view all events at once` | `render vertically`
    - If yes Quiz :
        - Individual Event Choice 1: https://ui.shadcn.com/docs/components/radio-group
            `To view all events at once` | `no drawing` | `render vertically`

- Group 4:
    - Do you want to participate in quiz ?: https://ui.shadcn.com/docs/components/radio-group
        `YES | NO` | `render horizontally`

### Section 3: Logistics

- Date and time of Arrival: https://ui.shadcn.com/docs/components/date-picker
- Do you need pickup facility: https://ui.shadcn.com/docs/components/radio-group
- Mode of Travel: https://ui.shadcn.com/docs/components/input-group
- Pickup Point: https://ui.shadcn.com/docs/components/input-group

- Date and time of Departure: https://ui.shadcn.com/docs/components/date-picker
- Do you need drop facility: https://ui.shadcn.com/docs/components/radio-group
- Mode of Travel: https://ui.shadcn.com/docs/components/input-group
- Drop Point: https://ui.shadcn.com/docs/components/input-group

### Section 4: Accompanying (might require deduplication)

- Are Adults Accompanying ?
    `YES | NO` | `render horizontally`
- If No:
    `Go to next section`
- If Yes:
    - Number of Male Members ?: https://ui.shadcn.com/docs/components/slider
        `Get all names`
    - Number of Female Members ?: https://ui.shadcn.com/docs/components/slider
        `Get all names`
    - Point of Contact: https://ui.shadcn.com/docs/components/card
        - Name: https://ui.shadcn.com/docs/components/input 
        - Gender: https://ui.shadcn.com/docs/components/radio-group
        - Relation: https://ui.shadcn.com/docs/components/radio-group 
            `(Guru, Mother, Father, Legal Guardian)`
        - Phone Number: https://ui.shadcn.com/docs/components/radio-group
        - Age: https://ui.shadcn.com/docs/components/radio-group 
            `18 - 65` | `65+`

### Section 5: Accomodation

- Do you want accomodation (student) ?: https://ui.shadcn.com/docs/components/radio-group
    `YES | NO` | `render horizontally`
- If No to Accomodation:
   `Preview And Confirm` 
- If Yes to Accomodation:
    `Don't ask if section-4 has NO for accompanying`
    - Number of Male Members ?: https://ui.shadcn.com/docs/components/slider
        `Limit by previously suggested slider`
    - Number of Female Members ?: https://ui.shadcn.com/docs/components/slider
        `Limit by previously suggested slider`

    `If logistics Arrival + Departure exists, then we use same data`
    - Check-In Date and Time: https://ui.shadcn.com/docs/components/date-picker
    - Check-Out Date and Time: https://ui.shadcn.com/docs/components/date-picker
