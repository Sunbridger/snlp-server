# NLP Service

确保node 版本保持在 v14.16.0 之上

## **/search** 
>请求方式: GET （NLP 处理对应的关键词匹配最佳答案）

入参
  
|  字段   | 类型  |
|  ----  | ----  |
| keyword  | string |


出参

|  字段   | 类型  |
|  ----  | ----  |
| data  | string |



## **/train** 
>请求方式: POST （训练 NLP）

入参

|  字段   | 类型  |
|  ----  | ----  |
| questions  | Array<string> |
| answer  | string |
| group  | string |


出参

|  字段   | 类型  |
|  ----  | ----  |
| data  | string |


