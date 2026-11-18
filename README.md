# On web, a `TextInput` misses a `set()` write to the state it was given

`@expo/ui` 58.0.29, Expo SDK 58 (`expo` 58.0.26, React Native 0.88.1,
react-native-web 0.21.4), the React Compiler on (`experiments.reactCompiler`
in `app.json`), Chrome.

1. `npm install`, then `npx expo start --web`.
2. The page has five rows. Each passes a `useNativeState` to an `@expo/ui`
   `TextInput` as `value`, and its **Read state** button shows what that
   state holds:
   1. **Clear** calls `set('')`.
   2. Row 1, with `'use no memo'` in the component.
   3. The controlled example from the `TextInput` docs: typing "Hello" makes
      the field "World", by assigning `text.value`.
   4. Row 3, written with `set()`.
   5. Row 1, with **Clear** assigning `text.value = ''`.
3. Press **Clear** in rows 1, 2 and 5, type "Hello" into rows 3 and 4, then
   press each row's **Read state**.

Expected: each field shows what its state holds.

Actual:

| Row | Field | State |
| --- | --- | --- |
| 1. `set('')` from a button | `Some text` | `""` |
| 2. The same, `'use no memo'` | empty | `""` |
| 3. The docs' example, assigning `value` | `World` | `"World"` |
| 4. The docs' example, `set()` | `o` | `"o"` |
| 5. Row 1, assigning `value` | empty | `""` |

On web, `useNativeState` is React state in the component that creates it, and
a write re-renders that component, as the `ObservableState` docs say. The
`TextInput` reads `state.value` in its own render. With the React Compiler on,
the creating component returns the `<TextInput>` element it memoized, because
none of that element's props changed. So the `TextInput` does not render again.
In row 1 the field keeps the old text. In row 4, after every keystroke React
puts the input back to what the `TextInput` last rendered, so each key
replaces the text, and typing "Hello" leaves "o", shown once the field blurs.

Rows 3 and 5 work only because assigning `text.value` modifies a value a hook
returned. The React Compiler leaves such a component uncompiled (its lint rule
reports "This value cannot be modified" on both lines), so they are not
memoized. `set()` is the write `@expo/ui` added for React Compiler
compatibility (expo/expo#46690), so a project that follows the docs with it
gets a compiled component, and the broken rows.

Android and iOS were not run: there the state is a native object the field
observes, so a write does not depend on a React render.
