const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const crossOrigin = require('./middleware/cross-origin');
const {
  initNLPServer,
  getAnswerByNLP,
  manualTrain,
} = require('./nlp/init');
const { port } = require('../config');
const { saveAllData, saveFeedBackData } = require('./mysql');

const app = new Koa();

let route = new Router();

app.use(crossOrigin);

app.use(bodyParser({
  enableTypes: ['json', 'form', 'text'],
}));

route.get('/search', async (ctx) => {
  const { keyword } = ctx.query;
  const answer = await getAnswerByNLP(keyword);
  ctx.body = {
    type: 'card',
    _id: keyword,
    content: {
      code: 'knowledge',
      data: {
        text: answer || '等我长大了再告诉你吧～'
      }
    },
    meta: {
      evaluable: true // 是否展示点赞点踩按钮
    }
  };
});

route.get('/evaluate', async (ctx) => {
  const { answer_type, question } = ctx.query;
  await saveFeedBackData({ answer_type, question });
  ctx.body = {
    success: true,
    data: {
      answer_type,
      question,
    }
  };
});

route.post('/feedback', async (ctx) => {
  const { question, category, remark } = ctx.request.body;
  await saveFeedBackData({ question, category, remark }, false);
  ctx.body = {
    success: true,
    data: {
      question, category, remark,
    }
  };
});

route.post('/train', async (ctx) => {
  const { questions, answer, group } = ctx.request.body;
  questions.forEach(async (question) => {
    // manualTrain.addDocument({
    //   question,
    //   group
    // });
    await saveAllData({ question, answer, group });
    // todo 智能分类处理后再进行落答案、问题库 再训练
    // saveQuestionData({ question, group });
  })
  
  // await manualTrain.addAnswer({
  //   answer,
  //   group
  // });
  // await saveAnswerData({ answer, group });
  
  // await manualTrain.train();

  ctx.body = {
    success: true,
    result: '训练完成',
  };

});

app.use(route.routes());

app.listen(port, async () => {
  await initNLPServer();
  console.log(`服务开启在${port}`);
});
