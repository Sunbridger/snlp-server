CREATE TABLE question_answer_table(  
    id int NOT NULL primary key AUTO_INCREMENT comment 'primary key',
    create_time TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
    update_time TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update time',
    question varchar(255) comment '问题',
    answer varchar(255) comment '答案',
    group_name varchar(255) comment '组'
) default charset utf8 comment '这是一条聚合表';