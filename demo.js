const Lexer = require("./src/lexer");
const Parser = require("./src/parser");

const sql0 = "create database mydb;";
const sql1 = "create table students(sname varchar(3), sage int);";
const sql2 = `drop table students;`;
const sql3 = `insert into students(sname, sage) values('qhy', 21);`;
const sql4 = "select * from students;";
const sql5 = "SELECT * FROM table_name WHERE column_name > 1;";
const sql6 = "delete from students where sage > 2;";
const sql7 = `update students set sage=20 where sname='qhy';`;

// 词法分析器
const lexer = new Lexer();
// 语法分析器
const parser = new Parser();

const tokens = lexer.tokenize(sql6);
console.log("tokens为:\n", tokens);

parser.parse(tokens);

console.log("解析完毕");
