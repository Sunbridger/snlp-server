CREATE TABLE question_table(  
    id int NOT NULL primary key AUTO_INCREMENT comment 'primary key',
    create_time DATETIME COMMENT 'create time',
    update_time DATETIME COMMENT 'update time',
    question varchar(255) comment '问题',
    group_name varchar(255) comment '组'
) default charset utf8 comment '';