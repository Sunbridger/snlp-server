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

route.get('/hotquestion', async (ctx) => {
  ctx.body = {
    success: true,
    data: [
      {
        title: '公司目前有哪些基建？',
        hot: true,
        content: '公司目前有哪些基建？'
      },
      {
        title: '新人入职相关文档在哪看？',
        hot: true,
        content: '新人入职相关文档在哪看？'
      },
      {
        title: '关于政采云前端团队？',
        content: '关于政采云前端团队？'
      },
      {
        title: '我要去训练',
        content: '我要去训练'
      },
    ],
  };
});

route.get('/search', async (ctx) => {
  const { keyword } = ctx.query;
  const answer = await getAnswerByNLP(keyword);
  ctx.body = {
    type: 'card',
    _id: `${keyword}?=${answer}`,
    content: {
      code: 'knowledge',
      data: {
        text: answer || `「${keyword}」这个问题等我长大了再告诉你吧～`
      }
    },
    meta: {
      evaluable: true // 是否展示点赞点踩按钮
    }
  };
});

route.get('/evaluate', async (ctx) => {
  const { answer_type, question, answer } = ctx.query;
  await saveFeedBackData({ answer_type, question, answer });
  ctx.body = {
    success: true,
    data: {
      answer_type,
      question,
      answer,
    }
  };
});

route.post('/feedback', async (ctx) => {
  const { question, category, remark, answer } = ctx.request.body;
  await saveFeedBackData({ question, answer, category, remark }, false);
  ctx.body = {
    success: true,
    data: {
      question, category, remark, answer
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
