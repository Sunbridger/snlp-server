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
const { saveAllData } = require('./mysql');

const app = new Koa();

let route = new Router();

app.use(crossOrigin);

app.use(bodyParser());

route.get('/search', async (ctx) => {
  const { keyword } = ctx.query;
  const answer = await getAnswerByNLP(keyword);
  ctx.body = {
    type: 'card',
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

// todo 点赞点踩
route.get('/evaluate', async (ctx) => {
  const { evaluateType, messageId } = ctx.query;
  ctx.body = {
    success: true,
    data: {
      evaluateType,
      messageId,
    }
  };
});

// todo 反馈
route.get('/feedback', async (ctx) => {
  const { messageId, text } = ctx.query;
  ctx.body = {
    success: true,
    data: {
      messageId,
      text,
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
