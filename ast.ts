
export type Stmt =
  | { tag: "define", name: string, value: Expr }
  | { tag: "expr", expr: Expr }

export type Expr =
    { tag: "num", value: number }
  | { tag: "id", name: string }
  | { tag: "builtin1", name: string, arg: Expr }
  | { tag: "binop", op: BinOp, arg1: Expr, arg2: Expr}
  | { tag: "builtin2", name: string, arg1: Expr, arg2: Expr}

export enum BinOp { Plus, Minus, Mul }
