import * as mocha from 'mocha';
import {expect} from 'chai';
import { parser } from 'lezer-python';
import { traverseExpr, traverseStmt, traverse, parse, parseArgs, definedVars } from '../parser';
import { BinOp } from '../ast';

// We write tests for each function in parser.ts here. Each function gets its 
// own describe statement. Each it statement represents a single test. You
// should write enough unit tests for each function until you are confident
// the parser works as expected. 
describe('traverseExpr(c, s) function', () => {
  it('parses a number in the beginning', () => {
    const source = "987";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({tag: "num", value: 987});
  })

  // TODO: add additional tests here to ensure traverseExpr works as expected
  it('parses a variable name', () => {
    definedVars.push('x');
    const source ="x";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);
    expect(parsedExpr).to.deep.equal({tag: "id", name: 'x'});
  })

  it('parses a Unary Expression', () => {
    const source ="-1";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);
    expect(parsedExpr).to.deep.equal({tag: "num", value: -1});
  })

  it('fails parsing a Unary Expression other than + or -', () => {
    const source ="--1";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    try {
      const parsedExpr = traverseExpr(cursor, source);
    }
    catch(error) {
      expect(error.message).to.deep.equal("ParseError: unary operation failed");
    }
  })

  it('parses a Call Expression buildin1 abs', () => {
    const source ="abs(-1)";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);
    expect(parsedExpr).to.deep.equal({tag: "builtin1", name: 'abs', arg: { tag: "num", value: -1}});
  })

  it('parses a Call Expression buildin1 print', () => {
    const source ="print(-1)";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);
    expect(parsedExpr).to.deep.equal({tag: "builtin1", name: 'print', arg: { tag: "num", value: -1}});
  })

  it('parses a Call Expression buildin2 max', () => {
    const source ="max(-1,1)";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);
    expect(parsedExpr).to.deep.equal({tag: "builtin2", name: 'max', arg1: { tag: "num", value: -1}, arg2: { tag: "num", value: 1}});
  })

  it('parses a Call Expression buildin2 min', () => {
    const source ="min(-1,1)";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);
    expect(parsedExpr).to.deep.equal({tag: "builtin2", name: 'min', arg1: { tag: "num", value: -1}, arg2: { tag: "num", value: 1}});
  })

  it('parses a Call Expression buildin2 pow', () => {
    const source ="pow(2,2)";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);
    expect(parsedExpr).to.deep.equal({tag: "builtin2", name: 'pow', arg1: { tag: "num", value: 2}, arg2: { tag: "num", value: 2}});
  })

  it('fails parsing a Call Expression having more than 2 args', () => {
    const source ="max(2,1,3)";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    try {
      const parsedExpr = traverseExpr(cursor, source);
    } catch (error) {
      expect(error.message).to.deep.equal("ParseError: more than 2 arguements");
    }
  })

  it('parses a single Binary Expression', () => {
    const source ="1+2";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);
    expect(parsedExpr).to.deep.equal({tag: "binop", op: BinOp.Plus, arg1: { tag: "num", value: 1}, arg2: { tag: "num", value: 2}});
  })

  it('parses a multiple Binary Expression', () => {
    const source ="1+2*3";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);
    expect(parsedExpr).to.deep.equal({tag: "binop", op: BinOp.Plus, arg1: { tag: "num", value: 1}, arg2: {tag: "binop", op: BinOp.Mul, arg1: { tag: "num", value: 2}, arg2: { tag: "num", value: 3}}});
  })

  it('fails parsing a Binary Expression other than +,-, and *', () => {
    const source ="2/2";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    try {
      const parsedExpr = traverseExpr(cursor, source);
    } catch (error) {
      expect(error.message).to.deep.equal("ParseError: unknown binary operator");
    }
   })

   it('fails parsing list expression', () => {
    const source ="[1,2]";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    try {
      const parsedExpr = traverseExpr(cursor, source);
    } catch (error) {
      expect(error.message).to.deep.equal("ParseError: Could not parse expr at 0 5: [1,2]");
    }
   })
});

describe('traverseStmt(c, s) function', () => {
  // TODO: add tests here to ensure traverseStmt works as expected
  it('parses assignment statement', () => {
    const source = "x=4";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();

    const parsedExpr = traverseStmt(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({tag: "define", name: "x", value: {tag: "num", value: 4}});
  })

  it('parses expression statement', () => {
    const source = "x";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();

    const parsedExpr = traverseStmt(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({tag: "expr", expr: {tag: "id", name: "x"}});
  })
});

describe('traverse(c, s) function', () => {
  // TODO: add tests here to ensure traverse works as expected
  it('parses script', () => {
    const source = "x=4";
    const cursor = parser.parse(source).cursor();

    const parsedExpr = traverse(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal([{tag: "define", name: "x", value: {tag: "num", value: 4}}]);
  })
});

describe('parse(source) function', () => {
  it('parse a number', () => {
    const parsed = parse("987");
    expect(parsed).to.deep.equal([{tag: "expr", expr: {tag: "num", value: 987}}]);
  });  

  // TODO: add additional tests here to ensure parse works as expected
  it('parses a Unary Expression', () => {
    const parsed = parse("-1");
    expect(parsed).to.deep.equal([{tag: "expr", expr: {tag: "num", value: -1}}]);
  })

  it('parses a Call Expression buildin1 abs', () => {
    const parsed = parse("abs(-1)");
    expect(parsed).to.deep.equal([{tag: "expr", expr: {tag: "builtin1", name: 'abs', arg: { tag: "num", value: -1}}}]);
  })

  it('parses a Call Expression buildin2 max', () => {
    const parsed = parse("max(-1,1)");
    expect(parsed).to.deep.equal([{tag: "expr", expr: {tag: "builtin2", name: 'max', arg1: { tag: "num", value: -1}, arg2: { tag: "num", value: 1}}}]);
  })

  it('parses a multiple Binary Expression', () => {
    const parsed = parse("1+2*3");
    expect(parsed).to.deep.equal([{tag: "expr", expr: {tag: "binop", op: BinOp.Plus, arg1: { tag: "num", value: 1}, arg2: {tag: "binop", op: BinOp.Mul, arg1: { tag: "num", value: 2}, arg2: { tag: "num", value: 3}}}}]);
  })

});

describe('parseArgs(cursor, source) function', () => {
  it('parses arguments of length 1', () => {
    const source ="abs(-1)";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    cursor.firstChild();
    const callName = source.substring(cursor.from, cursor.to);
    cursor.nextSibling(); // go to arglist
    cursor.firstChild(); // go into arglist
    var args = parseArgs(cursor, source);

    expect(args).to.deep.equal([{ tag: "num", value: -1}]);
  })

  it('parses arguments of length 2', () => {
    const source ="max(2,3)";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    cursor.firstChild();
    const callName = source.substring(cursor.from, cursor.to);
    cursor.nextSibling(); // go to arglist
    cursor.firstChild(); // go into arglist
    var args = parseArgs(cursor, source);

    expect(args).to.deep.equal([{ tag: "num", value: 2}, { tag: "num", value: 3}]);
  })
})