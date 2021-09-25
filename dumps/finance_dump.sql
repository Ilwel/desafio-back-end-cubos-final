drop table if exists users;

create table if not exists users(
	id serial primary key,
 	name varchar(30) not null,
	email text not null,
 	password text not null,
 	cpf varchar(11),
  	phone varchar(11)
);