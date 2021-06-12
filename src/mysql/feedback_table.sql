CREATE TABLE feedback_table(  
  id int NOT NULL primary key AUTO_INCREMENT comment 'primary key',
  create_time TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
  update_time TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update time',
  question varchar(255) NOT NULL comment '提出的问题',
  answer_type varchar(25) NOT NULL comment '对该条问题的态度',
  category varchar(255) comment '不满意的分类选项',
  remark varchar(255) comment '来自用户输入的评论'
) default charset utf8 comment '这是一条反馈表';