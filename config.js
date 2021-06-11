module.exports = {
  port: 9890,
  mysqlClient: {
    mysql: { // 数据库存连接配置
      // host
      host: 'sunbridger.site',
      // 端口号
      port: '3333',
      // 用户名
      user: 'root',
      // 密码
      password: '123456',
      // 数据库名
      database: 'nlp-data',
    },
    config: config => { // 数据库工具配置
      // 监听事件 执行前
      config.onBeforeExecute(function({ sql }) {
        console.log(`开始执行 ${sql}`);
      });

      // 监听事件 执行后
      config.onAfterExecute(function({ sql }) {
        console.log(`${sql} 执行完毕`);
      });

      // 监听事件 执行出错
      config.onExecuteError(function({ sql, error }) {
        console.log(`${sql} 执行出错了：${error}`);
      });
    },
  },
};