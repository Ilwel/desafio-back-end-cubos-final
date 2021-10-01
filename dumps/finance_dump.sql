drop table if exists users;

create table if not exists users(
	id serial primary key,
 	name varchar(30) not null,
	email text not null,
 	password text not null,
 	cpf varchar(11),
  	phone varchar(11)
);

drop table if exists clients;

create table if not exists clients(
	id serial primary key,
	name varchar not null,
	email text not null unique,
	cpf varchar (11) not null,
	phone varchar (11) not null,
	zip_code varchar (8),
	adress text, 
	complement text, 
	district text, 
	city text, 
	reference_point text,
	state text
);