CREATE TABLE answer_table(  
    id int NOT NULL primary key AUTO_INCREMENT comment 'primary key',
    create_time DATETIME COMMENT 'create time',
    update_time DATETIME COMMENT 'update time',
    answer varchar(255) comment '答案',
    group_name varchar(255) comment '组'
) default charset utf8 comment '';