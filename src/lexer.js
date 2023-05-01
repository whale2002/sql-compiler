const { rules } = require("./rules");

class Lexer {
  constructor() {
    this.rules = rules;
  }

  tokenize(input) {
    // 去除开头的空格
    input = input.replace(/^\s+/, "");
    const results = [];
    let match;

    do {
      try {
        // create table students
        match = this.matchPrefix(input);
        // 把匹配到的字符串剔除，去除空格
        input = input.substring(match.value.length).replace(/^\s+/, "");
        results.push(match);
      } catch (error) {
        break;
      }
    } while (match && input.length > 0);

    return results;
  }

  matchPrefix(input) {
    const longestMatch = {
      id: null,
      value: "",
    };

    for (let i = 0; i < this.rules.length; i++) {
      const rule = this.rules[i];
      // 通过正则匹配
      const match = input.match(rule.pattern);
      // 不匹配继续 continue
      if (!match) continue;
      const lexeme = match.shift();
      if (lexeme.length > longestMatch.value.length) {
        longestMatch.value = lexeme;
        longestMatch.id = rule.id;
      }
    }

    if (!longestMatch.id) {
      throw new Error(`no matching rule for input: ${input}`);
    }

    return longestMatch;
  }
}

module.exports = Lexer;
