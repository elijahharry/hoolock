import acorn from "acorn";

export interface VariableDeclaration {
  name: string;
  kind: string;
}

const parseVariableDeclarations = (
  contents: string,
  type: "module" | "script" = "module"
) => {
  const declarations: VariableDeclaration[] = [];

  const ast = acorn.parse(contents, {
    sourceType: type,
    ecmaVersion: "latest",
  }) as any;

  if (ast.body) {
    ast.body.forEach((node: any) => {
      if (node.type && /^(Variable|Function)Declaration$/.test(node.type)) {
        let id = node.id;
        if (id) {
          id = id.name;
        } else if (node.declarations) {
          const zero = node.declarations[0];
          if (zero && zero.type === "VariableDeclarator") {
            id = zero.id?.name;
          }
        }

        if (typeof id !== "string") return;

        declarations.push({
          name: id,
          kind: node.kind ?? "var",
        });
      }
    });
  }

  return declarations;
};

export default parseVariableDeclarations;
