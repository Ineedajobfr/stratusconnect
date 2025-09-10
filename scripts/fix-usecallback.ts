// scripts/fix-usecallback.ts
import { Project, SyntaxKind, Node, ArrowFunction, Identifier } from "ts-morph";
import path from "path";

const FILES = [
  "src/components/AdvancedAnalytics.tsx",
  "src/components/BillingSystem.tsx",
  "src/components/ContractManagement.tsx",
  "src/components/EnhancedMarketplace.tsx",
  "src/components/EnhancedMessaging.tsx",
  "src/components/EscrowManagement.tsx",
  "src/components/FleetManagement.tsx",
  "src/components/MarketIntelligence.tsx",
  "src/components/Marketplace.tsx",
  "src/components/MessagingSystem.tsx",
  "src/components/NotificationCenter.tsx",
  "src/components/ProfileWidget.tsx",
  "src/components/ReputationSystem.tsx",
  "src/components/SanctionsScreening.tsx",
  "src/components/StrikeManagement.tsx",
  "src/components/UserProfile.tsx",
  "src/components/messaging/MessageCenter.tsx",
  "src/components/psych/PsychReport.tsx",
  "src/components/reviews/ReviewsList.tsx",
  "src/components/ui/notification-center.tsx",
  "src/hooks/usePageContent.ts",
  "src/pages/ProfileSettings.tsx",
  "src/pages/SecureAdminSetup.tsx",
];

const STABLE_GLOBALS = new Set([
  "window","document","console","Math","Date","Intl","URL","Array","Object","Number","String","Boolean","Set","Map","WeakMap","WeakSet"
]);

// Heuristic: ignore identifiers that look like React state setters, e.g. setSomething
function isSetterName(name: string) {
  return /^set[A-Z]/.test(name);
}

function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function ensureUseCallbackImport(source: import("ts-morph").SourceFile) {
  const imports = source.getImportDeclarations();
  const reactImport = imports.find(i => i.getModuleSpecifierValue() === "react");
  if (!reactImport) {
    source.addImportDeclaration({ moduleSpecifier: "react", namedImports: ["useCallback"] });
    return;
  }
  const has = reactImport.getNamedImports().some(n => n.getName() === "useCallback");
  if (!has) reactImport.addNamedImport("useCallback");
}

function idIsLocal(id: Identifier) {
  const decl = id.getDefinitionNodes()[0];
  if (!decl) return false;
  const kind = decl.getKind();
  // locals: parameters, const/let within same function, function declarations inside
  return (
    kind === SyntaxKind.Parameter ||
    kind === SyntaxKind.VariableDeclaration ||
    kind === SyntaxKind.FunctionDeclaration ||
    kind === SyntaxKind.CatchClause
  );
}

function idIsThisFileTopLevelConst(id: Identifier) {
  const decl = id.getDefinitionNodes()[0];
  if (!decl) return false;
  const varDecl = Node.isVariableDeclaration(decl) ? decl : undefined;
  if (!varDecl) return false;
  const parent = varDecl.getFirstAncestorByKind(SyntaxKind.SourceFile);
  return !!parent && !varDecl.getFirstAncestorByKind(SyntaxKind.FunctionDeclaration) && !varDecl.getFirstAncestorByKind(SyntaxKind.ArrowFunction);
}

function collectOuterRefs(fn: ArrowFunction) {
  const ids = fn.getDescendantsOfKind(SyntaxKind.Identifier);
  const params = new Set(fn.getParameters().map(p => p.getName()));
  const locals = new Set<string>();
  // locals inside the function body
  fn.getDescendantsOfKind(SyntaxKind.VariableDeclaration).forEach(v => locals.add(v.getName()));
  fn.getDescendantsOfKind(SyntaxKind.FunctionDeclaration).forEach(f => locals.add(f.getName() ?? ""));

  const refs: string[] = [];
  for (const id of ids) {
    const name = id.getText();
    if (params.has(name)) continue;
    if (locals.has(name)) continue;
    if (STABLE_GLOBALS.has(name)) continue;
    if (isSetterName(name)) continue;

    // If identifier is property access "ref.current", we consider the base "ref" only
    const parent = id.getParent();
    if (Node.isPropertyAccessExpression(parent) && parent.getName() === "current" && parent.getExpression() === id) {
      refs.push(name);
      continue;
    }

    // If this is a reference coming from outside the function
    if (!idIsLocal(id)) {
      refs.push(name);
    }
  }
  // Heuristic: do not include top level consts that are literal or imported constants
  return unique(refs).filter(n => n !== "" && !idIsThisFileTopLevelConst(fn.getFirstDescendantByKind(SyntaxKind.Identifier) as Identifier));
}

function functionName(node: Node) {
  if (Node.isVariableDeclaration(node)) return node.getName();
  return undefined;
}

function isAsyncArrowInit(node: Node) {
  if (!Node.isVariableDeclaration(node)) return false;
  const init = node.getInitializer();
  return Node.isArrowFunction(init) && init.isAsync();
}

function findUseEffectDepsArraysInFile(source: import("ts-morph").SourceFile) {
  const calls = source.getDescendantsOfKind(SyntaxKind.CallExpression).filter(c => c.getExpression().getText() === "useEffect");
  return calls.map(call => {
    const args = call.getArguments();
    const depArray = args[1];
    return { call, depArray };
  });
}

function functionNameAppearsInDeps(name: string, source: import("ts-morph").SourceFile) {
  const deps = findUseEffectDepsArraysInFile(source);
  for (const { depArray } of deps) {
    if (!depArray || !Node.isArrayLiteralExpression(depArray)) continue;
    const contains = depArray.getElements().some(e => e.getText() === name);
    if (contains) return true;
  }
  return false;
}

async function run() {
  const project = new Project({
    tsConfigFilePath: path.resolve("tsconfig.json"),
    skipFileDependencyResolution: true,
    addFilesFromTsConfig: false,
  });

  FILES.forEach(f => project.addSourceFileAtPathIfExists(path.resolve(f)));

  const sources = project.getSourceFiles();
  let changed = 0;

  for (const source of sources) {
    let fileChanged = false;

    const decls = source.getDescendantsOfKind(SyntaxKind.VariableDeclaration)
      .filter(isAsyncArrowInit);

    for (const decl of decls) {
      const name = functionName(decl);
      if (!name) continue;
      if (!functionNameAppearsInDeps(name, source)) continue;

      const init = decl.getInitializer() as ArrowFunction;
      // Skip if already a useCallback
      if (Node.isCallExpression(init.getParentOrThrow().getInitializerOrThrow()) &&
          init.getParentOrThrow().getInitializerOrThrow().getText().startsWith("useCallback(")) {
        continue;
      }

      const outerRefs = collectOuterRefs(init);
      // Build the new initializer
      const bodyText = init.getBody().getText();
      const asyncKeyword = init.isAsync() ? "async " : "";
      const depArrayText = `[${outerRefs.join(", ")}]`;

      decl.setInitializer(`useCallback(${asyncKeyword}() => ${bodyText.startsWith("{") ? bodyText : `{ return ${bodyText}; }`}, ${depArrayText})`);
      fileChanged = true;
    }

    if (fileChanged) {
      ensureUseCallbackImport(source);
      changed++;
    }
  }

  await project.save();
  // eslint-disable-next-line no-console
  console.log(`Updated ${changed} file(s). Review and commit.`);
}

run().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
