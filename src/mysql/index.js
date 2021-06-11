// 初始化数据库
const DbClient = require('ali-mysql-client');

const { mysqlClient } = require('../../config');

const DB = new DbClient(mysqlClient);

const getQuestion = async () => {
  const result = await DB.select('*')
    .from('question_table')
    .queryList();
  return result;
}

const getAnswer = async () => {
  const result = await DB.select('*')
    .from('answer_table')
    .queryList();
  return result;
}

const saveAnswerData = async ({ answer, group: group_name }) => {
  const result = await DB.insert('answer_table', {
    answer,
    group_name,
  }).execute();
  return result;
}

const saveQuestionData = async ({ question, group: group_name }) => {
  const result = await DB.insert('question_table', {
    question,
    group_name,
  }).execute();
  return result;
}

const saveAllData = async ({ answer, question, group: group_name }) => {
  const result = await DB.insert('question_answer_table', {
    question,
    group_name,
    answer,
  }).execute();
  return result;
}

module.exports = {
  getQuestion,
  getAnswer,
  saveAnswerData,
  saveQuestionData,
  saveAllData,
}