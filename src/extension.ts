/**
 * Pulsar VSCode Extension
 * In-process LSP features: diagnostics, hover, completion
 */

import * as vscode from 'vscode';

// ---------------------------------------------------------------------------
// Hover documentation map
// ---------------------------------------------------------------------------

const PSR_HOVER_DOCS: Record<string, string> = {
  component: [
    '**`component`** — PSR Component Declaration',
    '',
    'Declares a Pulsar reactive component. The function body runs once;',
    'reactive state is tracked via signals.',
    '',
    '```psr',
    'component Counter() {',
    '  const [count, setCount] = signal(0);',
    '  return <button onClick={() => setCount(c => c + 1)}>{count()}</button>;',
    '}',
    '```',
  ].join('\n'),

  signal: [
    '**`signal`** — Reactive Primitive',
    '',
    'Returns a `[getter, setter]` tuple. Reading `getter()` inside a reactive',
    'scope (component body, `createEffect`, `createMemo`) subscribes to updates.',
    '',
    '```psr',
    'const [value, setValue] = signal(0);',
    'setValue(1);          // set',
    'setValue(v => v + 1); // updater fn',
    'console.log(value()); // read',
    '```',
  ].join('\n'),

  createEffect: [
    '**`createEffect`** — Side Effect',
    '',
    'Runs immediately and re-runs whenever any signal read inside it changes.',
    '',
    '```psr',
    'createEffect(() => {',
    '  console.log("count is", count());',
    '});',
    '```',
  ].join('\n'),

  createMemo: [
    '**`createMemo`** — Derived Computation',
    '',
    'Lazily caches the result of a computation; re-computes only when dependencies change.',
    '',
    '```psr',
    'const doubled = createMemo(() => count() * 2);',
    '```',
  ].join('\n'),

  onMount: [
    '**`onMount`** — Mount Lifecycle Hook',
    '',
    'Runs after the component DOM has been inserted.',
    '',
    '```psr',
    'onMount(() => { console.log("mounted"); });',
    '```',
  ].join('\n'),

  onCleanup: [
    '**`onCleanup`** — Cleanup Lifecycle Hook',
    '',
    'Runs when the component is removed from the DOM.',
    '',
    '```psr',
    'onCleanup(() => clearInterval(timer));',
    '```',
  ].join('\n'),

  onBeforeMount: [
    '**`onBeforeMount`** — Pre-Mount Lifecycle Hook',
    '',
    'Runs just before the component tree is inserted into the DOM.',
  ].join('\n'),

  onError: [
    '**`onError`** — Error Lifecycle Hook',
    '',
    'Catches errors thrown inside the component subtree.',
    '',
    '```psr',
    'onError((err) => console.error("component error", err));',
    '```',
  ].join('\n'),

  createContext: [
    '**`createContext`** — Context Factory',
    '',
    'Creates a Symbol-keyed reactive context object.',
    '',
    '```psr',
    'const ThemeCtx = createContext("light");',
    '<ThemeCtx.Provider value="dark">',
    '  <Child />',
    '</ThemeCtx.Provider>',
    '```',
  ].join('\n'),

  useContext: [
    '**`useContext`** — Context Consumer',
    '',
    'Reads the nearest parent Provider value for the given context.',
    '',
    '```psr',
    'const theme = useContext(ThemeCtx);',
    '```',
  ].join('\n'),

  $when: [
    '**`$when`** — Conditional Rendering Directive',
    '',
    'Renders children only when `condition` is truthy; optionally renders `fallback`.',
    '',
    '```psr',
    '<$when condition={isLoggedIn()} fallback={<Login />}>',
    '  <Dashboard />',
    '</$when>',
    '```',
  ].join('\n'),

  $each: [
    '**`$each`** — List Rendering Directive',
    '',
    'Efficiently renders a reactive list with keyed reconciliation.',
    '',
    '```psr',
    '<$each items={list()} key="id">',
    '  {(item) => <li>{item.name}</li>}',
    '</$each>',
    '```',
  ].join('\n'),

  $portal: [
    '**`$portal`** — Portal Directive',
    '',
    'Renders children into a DOM node outside the component tree.',
    '',
    '```psr',
    '<$portal target={document.body}>',
    '  <Modal />',
    '</$portal>',
    '```',
  ].join('\n'),

  createStore: [
    '**`createStore`** — Redux-style State Container',
    '',
    'Creates a reactive store. `getState()` is signal-backed — reads inside',
    'components / effects auto-subscribe to dispatch updates.',
    '',
    '```psr',
    'const store = createStore(initialState, reducer);',
    'store.dispatch({ type: "INCREMENT" });',
    'const count = store.getState().count; // reactive!',
    '```',
  ].join('\n'),
};

// ---------------------------------------------------------------------------
// Diagnostic rules (regex-based, runs in-process without the transformer)
// ---------------------------------------------------------------------------

interface IDiagnosticRule {
  readonly pattern: RegExp;
  readonly message: string;
  readonly severity: vscode.DiagnosticSeverity;
}

const DIAGNOSTIC_RULES: IDiagnosticRule[] = [
  {
    pattern: /^component\s+[a-z]/m,
    message: 'PSR component names must start with an uppercase letter.',
    severity: vscode.DiagnosticSeverity.Error,
  },
  {
    pattern: /\bnull\s+as\s+any\b/,
    message: '`null as any` is forbidden — use a typed stub or explicit cast.',
    severity: vscode.DiagnosticSeverity.Warning,
  },
  {
    pattern: /\bclass\s+\w/,
    message: 'Use prototype-based constructors instead of `class`.',
    severity: vscode.DiagnosticSeverity.Warning,
  },
];

const validateDocument = (
  document: vscode.TextDocument,
  collection: vscode.DiagnosticCollection
): void => {
  if (document.languageId !== 'psr') return;

  const text = document.getText();
  const diagnostics: vscode.Diagnostic[] = [];

  for (const rule of DIAGNOSTIC_RULES) {
    const perLinePattern = new RegExp(rule.pattern.source, 'gm');
    let match: RegExpExecArray | null;

    while ((match = perLinePattern.exec(text)) !== null) {
      const pos = document.positionAt(match.index);
      const range = new vscode.Range(pos, document.lineAt(pos.line).range.end);
      diagnostics.push(new vscode.Diagnostic(range, rule.message, rule.severity));
    }
  }

  collection.set(document.uri, diagnostics);
};

// ---------------------------------------------------------------------------
// Completion items
// ---------------------------------------------------------------------------

const PSR_COMPLETION_KEYWORDS: vscode.CompletionItem[] = [
  ...Object.keys(PSR_HOVER_DOCS).map((keyword) => {
    const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
    item.documentation = new vscode.MarkdownString(PSR_HOVER_DOCS[keyword]);
    return item;
  }),
];

// ---------------------------------------------------------------------------
// Activation
// ---------------------------------------------------------------------------

export function activate(context: vscode.ExtensionContext): void {
  const diagnosticCollection = vscode.languages.createDiagnosticCollection('psr');
  context.subscriptions.push(diagnosticCollection);

  // Validate on open
  if (vscode.window.activeTextEditor?.document.languageId === 'psr') {
    validateDocument(vscode.window.activeTextEditor.document, diagnosticCollection);
  }

  // Validate on change
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((doc) => validateDocument(doc, diagnosticCollection)),
    vscode.workspace.onDidChangeTextDocument((e) =>
      validateDocument(e.document, diagnosticCollection)
    ),
    vscode.workspace.onDidCloseTextDocument((doc) => diagnosticCollection.delete(doc.uri))
  );

  // Validate all open PSR documents immediately
  vscode.workspace.textDocuments.forEach((doc) => validateDocument(doc, diagnosticCollection));

  // Hover provider
  context.subscriptions.push(
    vscode.languages.registerHoverProvider('psr', {
      provideHover(document, position) {
        const wordRange = document.getWordRangeAtPosition(position, /[\w$]+/);
        if (!wordRange) return undefined;

        const word = document.getText(wordRange);
        const doc = PSR_HOVER_DOCS[word];
        if (!doc) return undefined;

        return new vscode.Hover(new vscode.MarkdownString(doc), wordRange);
      },
    })
  );

  // Completion provider
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      'psr',
      {
        provideCompletionItems() {
          return PSR_COMPLETION_KEYWORDS;
        },
      },
      // Trigger characters
      '$',
      'c',
      's',
      'o',
      'u'
    )
  );
}

export function deactivate(): void {
  // DiagnosticCollection is disposed via context.subscriptions
}
