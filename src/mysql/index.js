// todo 连接数据库相关
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'sunbridger.site',   // 数据库地址
  port: '3333',
  user: 'root',    // 数据库用户
  password: '123456',   // 数据库密码
  database: 'nlp-data'  // 选中数据库
});

const _query = (queryStr) => new Promise((resolve) => {
  connection.query(queryStr, (error, results) => {
    if (error) {
      resolve([]);
      throw error;
    }
    resolve(results);
    // todo 结束当前回话
  });
});


const getDataFromData = (tableName) => {
  return _query(`SELECT * FROM ${tableName}`).then((res) => {
    return res;
  });
};

const saveQuestionData = ({ question, group: group_name }) => {
  return _query(`
    INSERT INTO question_table (question, group_name) VALUES ('${question}', '${group_name}');

  `).then((res) => res.length);
}

const saveAnswerData = ({ answer, group: group_name } ) => {
  return _query(`
    INSERT INTO answer_table (answer, group_name) VALUES ('${answer}', '${group_name}');

  `).then((res) => res.length);
}

const getQuestion = () => getDataFromData('question_table');

const getAnswer = () => getDataFromData('answer_table');

module.exports = {
  getQuestion,
  getAnswer,
  saveAnswerData,
  saveQuestionData,
};
