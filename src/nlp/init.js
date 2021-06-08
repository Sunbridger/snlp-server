
const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangZh } = require('@nlpjs/lang-zh');
const { getQuestion, getAnswer } = require('../mysql');
const ZH = 'zh';
let nlp = null;

// 初始化 NLP 实例
const initNLP = async () => {
  const container = await containerBootstrap();
  container.use(Nlp);
  container.use(LangZh);
  nlp = container.get('nlp');
  nlp.settings.autoSave = false;
  nlp.addLanguage(ZH);
};
// NLP 训练
const train = async () => {
  await nlp.train();
};
// 初始化 NLP 训练
const initTrainNLP = async () => {
  await addDocumentInit();
  await addAnswerInit();
  await train();
};
// 初始化 NLP 从问题库里拉取数据训练问题
const addDocumentInit = async () => {
  // Adds the utterances and intents for the NLP
  const arr = await getQuestion();
  // 优化为分片？
  await Promise.all(arr.map(async ({ question, group_name: group }) => addDocument({ question, group })));
  // arr.forEach(({ question, group_name: group }) => {
  //   addDocument({ question, group });
  // });
};
// 初始化 NLP 从答案库里拉取数据训练答案
const addAnswerInit = async () => {
  // Train also the NLG
  const arr = await getAnswer();
  await Promise.all(arr.map(async ({ answer, group_name: group }) => addAnswer({ answer, group })));
  // arr.forEach(({ answer, group_name: group }) => {
  //   addAnswer({ answer, group });
  // });
};

// 获取 NLP 匹配的数据
const getAnswerFromNLP = async (keyword) => {
  const response = await nlp.process(ZH, keyword);
  console.log(response, '---response');
  return response.answer;
};
// NLP 增加问题训练
const addDocument = async ({ question, group }) => {
  await nlp.addDocument(ZH, question, group);
};
// NLP 增加答案训练
const addAnswer = async ({ answer, group }) => {
  await nlp.addAnswer(ZH, group, answer);
};

module.exports = {
  initTrainNLP,
  getAnswerFromNLP,
  addDocument,
  addAnswer,
  addDocumentInit,
  addAnswerInit,
  initNLP,
  train,
};