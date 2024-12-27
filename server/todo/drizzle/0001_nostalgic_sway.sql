CREATE TABLE "todos" (
	"createdAt" timestamp DEFAULT now(),
	"title" varchar(255) NOT NULL,
	"description" text,
	"done" boolean DEFAULT false NOT NULL,
	"updatedAt" timestamp DEFAULT now()
);
