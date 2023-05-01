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
    const result = this.expect(id, true, false);
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

  // <select command> ::= "SELECT" <values selected> "from" <listado identificadores> <condicionales> ";"
  selectCommand() {
    fns._consume("SELECT");
    // INSERT CODIGO INTERMEDIO DE SELECT aqui
    fns.values_selected();
    listado_identificadores();
    fns.conditionals();
    fns._consume("SEMICOLON");
  }

  elementos_tabla() {
    // 遇到标识符
    if (this.expect("IDENTIFIER")) {
      this.columna();
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
  columna() {
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

  listado_identificadores() {
    if (fns._expect("IDENTIFIER")) {
      fns.identifier();
      fns.listado_identificadores_prima();
    } else {
      throw new Error("must provide one or more identifiers");
    }
  }

  identifier() {
    var token = fns._consume("IDENTIFIER");
    var symbolId = fns._getSymbol(token);
    // INSERTAR CODIGO INTERMEDIO IDENTIFIER AQUI
  }

  // <operador relacional> ::= "<" | "<=" | ">" | ">=" | "==" | "!="
  relational_operator() {
    if (fns._expect("LESS_THAN")) {
      fns.lessThan();
    } else if (fns._expect("LESS_THAN_EQUALS")) {
      fns.lessThanEqual();
    } else if (fns._expect("MORE_THAN")) {
      fns.moreThan();
    } else if (fns._expect("MORE_THAN_EQUALS")) {
      fns.moreThanEqual();
    } else if (fns._expect("EQUALS")) {
      fns.equals();
    } else if (fns._expect("NOT_EQUAL")) {
      fns.notEquals();
    } else {
      throw new Error("expected relational operator");
    }
  }

  // <
  lessThan() {
    fns._consume("LESS_THAN");
    // INSERTAR CODIGO INTERMEDIO < AQUI
  }

  // <=
  lessThanEqual() {
    fns._consume("LESS_THAN_EQUALS");
    // INSERTAR CODIGO INTERMEDIO <= AQUI
  }

  // >
  moreThan() {
    fns._consume("MORE_THAN");
    // INSERTAR CODIGO INTERMEDIO > AQUI
  }

  // >=
  moreThanEqual() {
    fns._consume("MORE_THAN_EQUALS");
    // INSERTAR CODIGO INTERMEDIO >= AQUI
  }

  // ==
  equals() {
    fns._consume("EQUALS");
    // INSERTAR CODIGO INTERMEDIO == AQUI
  }

  // !=
  notEquals() {
    fns._consume("NOT_EQUAL");
    // INSERTAR CODIGO INTERMEDIO != AQUI
  }

  value_literal() {
    if (fns._expect("IDENTIFIER")) {
      fns.identifier();
    } else if (fns._expect("NUMBER")) {
      fns.number();
    } else if (fns._expect("STRING")) {
      fns.string();
    } else {
      throw new Error("expected value");
    }
  }

  string() {
    var token = fns._consume("STRING");
    var symbolId = fns._getSymbol(token);
    // INSERTAR CODIGO INTERMEDIO STRING AQUI
  }

  number() {
    var token = fns._consume("NUMBER");
    var symbolId = fns._getSymbol(token);
    // PARSEA EL VALOR DEL TOKEN
    // INSERTAR CODIGO INTERMEDIO NUMBER AQUI
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

  values_selected() {
    if (fns._expect("ASTERISK")) {
      fns._consume("ASTERISK");
    } else if (fns._expect("IDENTIFIER")) {
      fns.listado_identificadores();
    } else {
      throw new Error("expected * or one or more identifiers");
    }
  }

  conditionals() {
    if (fns._expect("WHERE")) {
      fns._consume("WHERE");
      // INSERT CODIGO INTERMEDIO DE CREATE_DB aqui
      fns.relational_operator();
      fns.value_literal();
    }
  }
}

module.exports = Parser;
