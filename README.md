Welcome to your new TanStack app! 

# Getting Started

To run this application:

```bash
bun install
bun dev
```

# Building For Production

To build this application for production:

```bash
bun run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
bun test
```

## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The following scripts are available:


```bash
bun lint
bun format
bun check
```

## Rules

- For any group, a participant can take either -> 1 indiviual event, 2 individual events, 1 group event or 1 group and 1 individual event.
- All group events are split into boys and girls
- Group 1 individual don't have boy/girl split
- Group 2 and 3, all events except elocution (Eng & Tamil), Quiz (grp 3), Drawing (grp 2 & 3), have boy/girl split
- Group 4 only allowed to participate in Quiz (no boy/girl split)
- Bhajans and Tamizh Chants can never be the 2 individual events together for a single participant
- IF Quiz/Drawing is an individual event, can't take part in a group event (for all group 1, 2 and 3)

### Group 1
1. No separation for boys/girls except for devotional chanting group event
2. We can choose only one - devotional chanting/drawing
3. Either just devotional chanting, or devotional chanting + individual 1, or individual event 1 and 2
4. If choosing 2 individual events, bhajans AND tamizh chants can't be taken together by a single participant

### Group 2 and 3
1. Group 2 has only drawing, group 3 has bothe Quiz and Drawing (both quiz and drawing are individual events)
2. Students participating in Quiz cannot participate in Drawing and vice versa.
3. Students participating in Quiz or drawing cannot participate in any group event. However, they can participate in any other individual event along with Quiz or Drawing.
4. If choosing 2 individual events, bhajans AND tamizh chants can't be taken together by a single participant

### Group 4 
1. Can only take Quiz/No quiz (no point of registering if they aren't gonna take quiz though?)
