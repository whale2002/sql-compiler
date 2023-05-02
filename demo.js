const Lexer = require("./src/lexer");
const Parser = require("./src/parser");
const Analyzer = require("./src/analyzer");

const sql0 = "create database mydb;";
const sql1 = "create table students(sname varchar(3), sage int);";
const sql2 = `drop table students;`;
const sql3 = `insert into students(sname, sage) values('qhy', 21);`;
const sql4 = "select * from students;";
const sql5 = "SELECT * FROM table_name WHERE column_name > 1;";
const sql6 = "delete from students where sage > 2;";
const sql7 = `update students set sage == 20 where sname == 'qhy';`;

const errorSql = `insert into students(sname, sage) values(1, 'chin');`;

// 词法分析器
const lexer = new Lexer();
const tokens = lexer.tokenize(sql3);
// 语法分析器
const parser = new Parser();
// 语法分析器件
const analyzer = new Analyzer();

console.log("tokens为:\n", tokens);

parser.parse(tokens);
console.log("语法分析完毕");

const _tokens = lexer.tokenize(errorSql);
const errors = analyzer.parseInsert(_tokens);
console.log("语义分析结果为\n", errors);
