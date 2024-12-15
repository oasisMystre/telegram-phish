CREATE TABLE "account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phoneNumber" text NOT NULL,
	"password" text NOT NULL,
	"session" text NOT NULL,
	CONSTRAINT "account_phoneNumber_unique" UNIQUE("phoneNumber")
);
