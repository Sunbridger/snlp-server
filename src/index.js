const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
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

app.use(async (ctx, next)=> {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
});

app.use(bodyParser());

route.get('/search', async (ctx) => {
  const { keyword } = ctx.query;
  const answer = await getAnswerFromNLP(keyword);
  ctx.body = {
    data: answer
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
    data: '训练完成',
  };

});

app.use(route.routes());

app.listen(9890, async () => {
  await initNLP();
  await initTrainNLP();
  console.log(9890);
})
