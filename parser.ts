import {parser} from "lezer-python";
import {TreeCursor} from "lezer-tree";
import {Expr, Stmt, BinOp } from "./ast";

export var definedVars : Array<string> = [];

export function parseArgs(c : TreeCursor, s : string) : Array<Expr> {

  var args : Array<Expr> = [];

  while(c.nextSibling()){
    args.push(traverseExpr(c, s));
    c.nextSibling(); // find single argument in arglist
  }

  return args
}

export function traverseExpr(c : TreeCursor, s : string) : Expr {
  switch(c.type.name) {
    case "Number":
      return {
        tag: "num",
        value: Number(s.substring(c.from, c.to))
      }
    case "VariableName":
      const name = s.substring(c.from, c.to)
      if (!definedVars.includes(name)) {
        throw new Error(`ReferenceError: name ${name} is not defined`)
      }
      return {
        tag: "id",
        name: name
      }

    case "UnaryExpression":
      c.firstChild(); // go into unary expression
      var uniOp = s.substring(c.from, c.to)
      if (uniOp !== "-"  && uniOp !== "+")
        throw new Error("ParseError: unsupported unary expression")
      c.parent(); // pop unary expression
      const num = Number(s.substring(c.from, c.to))
      if (isNaN(num))
        throw new Error("ParseError: unary operation failed")

      return {
        tag:  "num",
        value: num
      }

    case "CallExpression":
      c.firstChild();
      const callName = s.substring(c.from, c.to);
      c.nextSibling(); // go to arglist
      c.firstChild(); // go into arglist

      var args = parseArgs(c, s);
      console.log("args")
      if (args.length == 1) {
        if (callName !== "print" && callName !== "abs"){
          throw new Error("ParseError: unknown buildin1")
        }
        c.parent(); // pop arglist
        c.parent(); // pop CallExpression
        return {
          tag: "builtin1",
          name: callName,
          arg: args[0]
        };
      } else if (args.length == 2) {
        if (callName !== "max" && callName !== "min" && callName !== "pow"){
          throw new Error("ParseError: unknown buildin2")
        }
        c.parent(); // pop arglist
        c.parent(); // pop CallExpression
        return {
          tag: "builtin2",
          name: callName,
          arg1: args[0],
          arg2: args[1]
        };
      }

      throw new Error("ParseError: more than 2 arguements")

    case "BinaryExpression":
      c.firstChild();
      const left = traverseExpr(c, s);
      c.nextSibling();
      var op : BinOp;
      switch(s.substring(c.from, c.to)) {
        case "+":
          op = BinOp.Plus;
          break;
        case "-":
          op = BinOp.Minus;
          break;
        case "*":
          op = BinOp.Mul;
          break;
        default:
          throw new Error("ParseError: unknown binary operator")
      }
      c.nextSibling();
      const right = traverseExpr(c, s);
      c.parent(); // pop BinaryOperation
      return {tag: "binop", op: op, arg1: left, arg2: right}

    default:
      throw new Error("ParseError: Could not parse expr at " + c.from + " " + c.to + ": " + s.substring(c.from, c.to));
  }
}

export function traverseStmt(c : TreeCursor, s : string) : Stmt {
  switch(c.node.type.name) {
    case "AssignStatement":
      c.firstChild(); // go to name
      const name = s.substring(c.from, c.to);
      c.nextSibling(); // go to equals
      c.nextSibling(); // go to value
      const value = traverseExpr(c, s);
      c.parent();
      definedVars.push(name)
      return {
        tag: "define",
        name: name,
        value: value
      }
    case "ExpressionStatement":
      c.firstChild();
      const expr = traverseExpr(c, s);
      c.parent(); // pop going into stmt
      return { tag: "expr", expr: expr }
    default:
      throw new Error("ParseError: Could not parse stmt at " + c.node.from + " " + c.node.to + ": " + s.substring(c.from, c.to));
  }
}

export function traverse(c : TreeCursor, s : string) : Array<Stmt> {
  switch(c.node.type.name) {
    case "Script":
      const stmts = [];
      c.firstChild();
      do {
        stmts.push(traverseStmt(c, s));
      } while(c.nextSibling())
      console.log("traversed " + stmts.length + " statements ", stmts, "stopped at " , c.node);
      return stmts;
    default:
      throw new Error("ParseError: Could not parse program at " + c.node.from + " " + c.node.to);
  }
}
export function parse(source : string) : Array<Stmt> {
  definedVars = [];
  const t = parser.parse(source);
  return traverse(t.cursor(), source);
}
