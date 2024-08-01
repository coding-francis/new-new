-- Create "users" table
CREATE TABLE "public"."users" (
    "id" bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    "name" character varying NULL,
    "email" character varying NOT NULL,
    "password" character varying NOT NULL,
    PRIMARY KEY ("id")
);