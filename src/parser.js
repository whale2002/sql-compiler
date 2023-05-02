class Parser {
  constructor() {
    this.symbols = [];
    this.symbolsTable = {};
    this.fns = {};
    this.stream = [];
    this.code = [];
    this.pos = 0;
  }

  parse(stream) {
    this.stream = stream;
    this.pos = 0;
    this.symbols = [];
    this.code = [];
    this.symbolsTable = {};
    this.init();
  }

  expect(id, throwError = false, debug = true) {
    const token = this.stream[this.pos];
    if (token) {
      if (token.id === id) {
        return token;
      } else {
        if (throwError) {
          throw new Error(`parsing error: unexpected token, expected ${id}`);
        }
      }
    } else {
      throw new Error("parsing error: no tokens left");
    }
  }

  consume(id, searhcInSymbols = false) {
    const result = this.expect(id, false, false);
    if (result) {
      this.pos += 1;
      if (searhcInSymbols) return this.getSymbol(result);

      return result;
    }
  }

  getSymbol(token) {
    if (this.symbolsTable.hasOwnProperty[token.value]) {
      return this.symbolsTable[token.value];
    } else {
      const length = this.symbols.length;
      this.symbols.push(token.value);
      this.symbolsTable[token.value] = "s" + length;
      return this.symbolsTable[token.value];
    }
  }

  init() {
    if (this.expect("CREATE")) {
      return this.createCommand();
    } else if (this.expect("INSERT")) {
      return this.insertCommand();
    } else if (this.expect("SELECT")) {
      return this.selectCommand();
    } else if (this.expect("DROP")) {
      return this.dropCommand();
    } else if (this.expect("UPDATE")) {
      return this.updateCommand();
    } else if (this.expect("DELETE")) {
      return this.deleteCommand();
    } else {
      throw new Error("Invalid command");
    }
  }

  createCommand() {
    // 位置＋1
    this.consume("CREATE");

    if (this.expect("DATABASE")) {
      this.createDBCommand();
    } else if (this.expect("TABLE")) {
      this.createTableCommand();
    } else {
      throw new Error("error: expected 'database' or 'table'");
    }
  }

  createDBCommand() {
    this.consume("DATABASE");
    const token = this.consume("IDENTIFIER");
    const tokenId = this.getSymbol(token);
    this.code.push(1, tokenId);
    this.consume("SEMICOLON");
  }

  createTableCommand() {
    this.consume("TABLE");
    const token = this.consume("IDENTIFIER");
    this.getSymbol(token);

    this.consume("LEFT_PARENTHESIS");
    this.elementos_tabla();
    this.consume("RIGHT_PARENTHESIS");

    this.consume("SEMICOLON");
  }

  dropCommand() {
    // 位置＋1
    this.consume("DROP");

    this.expect("TABLE");
    this.consume("TABLE");

    const token = this.consume("IDENTIFIER");
    const tokenId = this.getSymbol(token);
    this.code.push(1, tokenId);
    this.consume("SEMICOLON");
  }

  updateCommand() {}

  deleteCommand() {}

  insertCommand() {
    // 往前推进
    this.consume("INSERT");

    // 往前推
    this.consume("INTO");

    // 标识符：表名称
    this.consume("IDENTIFIER");

    // 第一个括号：标识符
    this.consume("LEFT_PARENTHESIS");
    this.checkIdentifier();
    this.consume("RIGHT_PARENTHESIS");

    // 第二个括号，值
    this.consume("VALUES");
    this.consume("LEFT_PARENTHESIS");
    this.checkValue();
    this.consume("RIGHT_PARENTHESIS");

    this.consume("SEMICOLON");
  }

  elementos_tabla() {
    // 遇到标识符
    if (this.expect("IDENTIFIER")) {
      this.column();
      this.elementos_tabla_prima();
    }
  }

  // <elementos tabla prima> ::= lambda | "," <elemento tabla> <elementos tabla prima>
  elementos_tabla_prima() {
    if (this.expect("COMMA")) {
      this.consume("COMMA");
      this.elementos_tabla();
    }
  }

  // <columna> ::= <identificador> <tipo datos> <seccion varios>
  column() {
    const token = this.consume("IDENTIFIER");
    this.getSymbol(token);

    // 如果是字符串类型，继续往后推
    if (this.expect("VARCHAR")) {
      this.consume("VARCHAR");
      if (this.expect("LEFT_PARENTHESIS")) {
        this.consume("LEFT_PARENTHESIS");
        this.consume("DIGIT");
        this.consume("RIGHT_PARENTHESIS");
      }
    } else if (this.expect("INT")) {
      this.consume("INT");
    }
  }

  checkIdentifier() {
    if (this.expect("IDENTIFIER")) {
      // 是标识符，往前推
      this.consume("IDENTIFIER");
      // 检查符号
      this.checkComma("checkIdentifier");
    } else {
      throw new Error(`parsing error: unexpected token, expected IDENTIFIER`);
    }
  }

  checkValue() {
    if (this.expect("STRING")) {
      this.consume("STRING");
      this.checkComma("checkValue");
    } else if (this.expect("DIGIT")) {
      this.consume("DIGIT");
      this.checkComma("checkValue");
    } else if (this.expect("DIGITS")) {
      this.consume("DIGITS");
      this.checkComma("checkValue");
    }
  }

  // 检查逗号
  checkComma(type) {
    if (this.expect("COMMA")) {
      this.consume("COMMA");
      switch (type) {
        case "checkIdentifier":
          this.checkIdentifier();
          break;

        case "checkValue":
          this.checkValue();
          break;

        case "checkSelectValues":
          this.checkSelectValues();
          break;
      }
    }
  }

  // <select command> ::= "SELECT" <values selected> "from" <listado identificadores> <condicionales> ";"
  selectCommand() {
    this.consume("SELECT");

    // 检查值
    this.checkSelectValues();

    this.consume("FROM");

    this.consume("IDENTIFIER");

    // 检查条件约束
    this.conditionals();

    this.consume("SEMICOLON");
  }

  checkSelectValues() {
    // 通配符
    if (this.expect("ASTERISK")) {
      this.consume("ASTERISK");
    } else if (this.expect("IDENTIFIER")) {
      // 是标识符，往前推
      this.consume("IDENTIFIER");
      // 检查符号
      this.checkComma("checkSelectValues");
    } else {
      throw new Error("expected * or one or more identifiers");
    }
  }

  conditionals() {
    if (this.expect("WHERE")) {
      this.consume("WHERE");
      this.consume("IDENTIFIER");

      this.relational_operator();
      this.value_literal();
    }
  }

  // <operador relacional> ::= "<" | "<=" | ">" | ">=" | "==" | "!="
  relational_operator() {
    if (this.expect("LESS_THAN")) {
      this.lessThan();
    } else if (this.expect("LESS_THAN_EQUALS")) {
      this.lessThanEqual();
    } else if (this.expect("MORE_THAN")) {
      this.moreThan();
    } else if (this.expect("MORE_THAN_EQUALS")) {
      this.moreThanEqual();
    } else if (this.expect("EQUALS")) {
      this.equals();
    } else if (this.expect("NOT_EQUAL")) {
      this.notEquals();
    } else {
      throw new Error("expected relational operator");
    }
  }

  // <
  lessThan() {
    this.consume("LESS_THAN");
  }

  // <=
  lessThanEqual() {
    this.consume("LESS_THAN_EQUALS");
  }

  // >
  moreThan() {
    this.consume("MORE_THAN");
  }

  // >=
  moreThanEqual() {
    this.consume("MORE_THAN_EQUALS");
  }

  // ==
  equals() {
    this.consume("EQUALS");
  }

  // !=
  notEquals() {
    this.consume("NOT_EQUAL");
  }

  value_literal() {
    if (this.expect("IDENTIFIER")) {
      this.consume("IDENTIFIER");
    } else if (this.expect("DIGIT")) {
      this.number();
    } else if (this.expect("STRING")) {
      this.string();
    } else {
      throw new Error("expected value");
    }
  }

  string() {
    this.consume("STRING");
  }

  number() {
    this.consume("DIGIT");
  }

  listado_valores() {
    fns.value_literal();
    fns.listado_valores_prima();
  }

  listado_valores_prima() {
    if (fns._expect("COMMA")) {
      fns._consume("COMMA");
      fns.listado_valores();
    }
  }
}

module.exports = Parser;
