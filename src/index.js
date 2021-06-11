const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const crossOrigin = require('./middleware/cross-origin');
const {
  initTrainNLP,
  getAnswerFromNLP,
  addDocument,
  addAnswer,
  initNLP,
  train,
} = require('./nlp/init');
const { saveAnswerData, saveQuestionData } = require('./mysql');

const app = new Koa();
let route = new Router();

app.use(crossOrigin);

app.use(bodyParser());

route.get('/search', async (ctx) => {
  const { keyword } = ctx.query;
  const answer = await getAnswerFromNLP(keyword);
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
  questions.forEach((question) => {
    addDocument({
      question,
      group
    });
    saveQuestionData({ question, group });
  })
  
  await addAnswer({
    answer,
    group
  });
  await saveAnswerData({ answer, group });
  
  await train();

  ctx.body = {
    success: true,
    result: '训练完成',
  };

});

app.use(route.routes());

app.listen(9890, async () => {
  await initNLP();
  await initTrainNLP();
  console.log(9890);
})
