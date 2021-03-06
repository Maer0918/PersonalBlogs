DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS headers;

CREATE TABLE classes ( 
     id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR NOT NULL
);

CREATE TABLE books (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
	name VARCHAR NOT NULL,
	class INTEGER NOT NULL,
	CONSTRAINT fk_class
    FOREIGN KEY (class)  
    REFERENCES classes (id) 
);

CREATE TABLE articles (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
	name VARCHAR NOT NULL,
	path VARCHAR NOT NULL UNIQUE,
	book INTEGER NOT NULL,
	CONSTRAINT fk_book
    FOREIGN KEY (book)  
    REFERENCES books (id) 
);

CREATE TABLE headers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR NOT NULL,
    level INTEGER NOT NULL,
    article INTEGER NOT NULL,
    CONSTRAINT fk_article
    FOREIGN KEY (article)  
    REFERENCES articles (id) 
);
