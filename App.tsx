import { Button, Host, TextInput, useNativeState, type ObservableState } from '@expo/ui';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Each row shows its field and, on "Read state", what the state passed to it
// as `value` holds. The app is built with the React Compiler on (app.json).

function StateReader({ text, testID }: { text: ObservableState<string>; testID: string }) {
  const [read, setRead] = useState<string | null>(null);
  return (
    <View style={styles.inline}>
      <Host matchContents>
        <Button label="Read state" onPress={() => setRead(text.get())} />
      </Host>
      <Text testID={testID}>{read === null ? '' : `state: "${read}"`}</Text>
    </View>
  );
}

// 1. A state this component creates, passed to TextInput as `value` and
// cleared from a button.
function WrittenFromButton() {
  const text = useNativeState('Some text');
  return (
    <View style={styles.card}>
      <Text style={styles.title}>1. State written from a button</Text>
      <TextInput value={text} testID="field-1" />
      <Host matchContents>
        <Button label="Clear" onPress={() => text.set('')} />
      </Host>
      <StateReader text={text} testID="state-1" />
    </View>
  );
}

// 2. The same component, opted out of the React Compiler.
function WrittenFromButtonNoMemo() {
  'use no memo';
  const text = useNativeState('Some text');
  return (
    <View style={styles.card}>
      <Text style={styles.title}>2. The same, with "use no memo"</Text>
      <TextInput value={text} testID="field-2" />
      <Host matchContents>
        <Button label="Clear" onPress={() => text.set('')} />
      </Host>
      <StateReader text={text} testID="state-2" />
    </View>
  );
}

// 3. The controlled example from the TextInput docs: typing "Hello" makes
// the field "World".
function DocsExample() {
  const text = useNativeState('');
  return (
    <View style={styles.card}>
      <Text style={styles.title}>3. The docs' controlled example</Text>
      <TextInput
        value={text}
        testID="field-3"
        placeholder='Type "Hello"'
        onChangeText={(value) => {
          text.value = value === 'Hello' ? 'World' : value;
        }}
      />
      <StateReader text={text} testID="state-3" />
    </View>
  );
}

// 4. The docs' example written with set(), the React Compiler-compliant
// write, instead of assigning `value`.
function DocsExampleWithSet() {
  const text = useNativeState('');
  return (
    <View style={styles.card}>
      <Text style={styles.title}>4. The docs' example, written with set()</Text>
      <TextInput
        value={text}
        testID="field-4"
        placeholder='Type "Hello"'
        onChangeText={(value) => {
          text.set(value === 'Hello' ? 'World' : value);
        }}
      />
      <StateReader text={text} testID="state-4" />
    </View>
  );
}

// 5. Row 1 with the button assigning `value` instead of calling set().
function WrittenFromButtonByAssignment() {
  const text = useNativeState('Some text');
  return (
    <View style={styles.card}>
      <Text style={styles.title}>5. Row 1, assigning `value` instead</Text>
      <TextInput value={text} testID="field-5" />
      <Host matchContents>
        <Button
          label="Clear"
          onPress={() => {
            text.value = '';
          }}
        />
      </Host>
      <StateReader text={text} testID="state-5" />
    </View>
  );
}

export default function App() {
  return (
    <View style={styles.screen}>
      <WrittenFromButton />
      <WrittenFromButtonNoMemo />
      <DocsExample />
      <DocsExampleWithSet />
      <WrittenFromButtonByAssignment />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 24, paddingTop: 64, gap: 16, backgroundColor: '#fff' },
  card: { gap: 8, padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  title: { fontWeight: 'bold' },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
