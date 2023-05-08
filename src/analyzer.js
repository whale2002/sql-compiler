const tables = {
  students: {
    sname: "VARCHAR",
    sage: "INT",
  },
};

class Analyzer {
  constructor() {
    this.currentTokenIndex = 0;
    this.errors = [];
  }

  // 检查表名是否存在
  checkTableExists(tableName) {
    if (!tables[tableName]) {
      throw new Error(`Table ${tableName} does not exist`);
    }
  }

  // 检查类型是否匹配
  checkDataTypesMatch(tableName, columns, types) {
    const expectedColumns = Object.keys(tables[tableName]);

    // 首先判断参数长度是否符合要求
    if (expectedColumns.length !== columns.length) {
      this.errors.push(
        `Expected ${expectedColumns.length} values, got ${values.length}`
      );
      return;
    }

    for (let i = 0; i < expectedColumns.length; i++) {
      const expectedType = tables[tableName][expectedColumns[i]];
      const actualType = types[i];
      if (expectedType !== actualType) {
        this.errors.push(
          `Expected ${expectedType} for column ${expectedColumns[i]}, got ${actualType}`
        );
      }
    }
  }

  // 获取类型
  getType(value) {
    if (/^[0-9]+$/.test(value)) {
      return "INT";
    } else if (/^("|').*("|')$/.test(value)) {
      return "VARCHAR";
    }
  }

  // 开始解析
  parseInsert(tokens) {
    this.tokens = tokens;
    // 跳过insert
    this.currentTokenIndex++;
    // 跳过into
    this.currentTokenIndex++;

    // 获取表名
    const tableName = this.tokens[this.currentTokenIndex].value;
    // 检查表是否存在
    this.checkTableExists(tableName);

    // 跳过表名
    this.currentTokenIndex++;
    // 跳过(
    this.currentTokenIndex++;

    // 把列名都记录下来
    const columns = [];
    while (this.tokens[this.currentTokenIndex].id !== "RIGHT_PARENTHESIS") {
      columns.push(this.tokens[this.currentTokenIndex]);
      this.currentTokenIndex++;
      if (this.tokens[this.currentTokenIndex].id === "COMMA") {
        this.currentTokenIndex++;
      }
    }

    // 跳过)
    this.currentTokenIndex++;
    // 跳过values
    this.currentTokenIndex++;
    // 跳过(
    this.currentTokenIndex++;

    // 把类型记录下来
    const types = [];
    while (this.tokens[this.currentTokenIndex].id !== "RIGHT_PARENTHESIS") {
      types.push(this.getType(this.tokens[this.currentTokenIndex].value));
      this.currentTokenIndex++;
      if (this.tokens[this.currentTokenIndex].id === "COMMA") {
        this.currentTokenIndex++;
      }
    }

    // 检查数据类型是否匹配
    this.checkDataTypesMatch(tableName, columns, types);

    return this.errors;
  }
}

module.exports = Analyzer;
