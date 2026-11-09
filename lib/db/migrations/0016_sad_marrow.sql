ALTER SEQUENCE "public"."admission_number_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1001 CACHE 1;
-- The ALTER above only updates the recorded start value for a future bare
-- RESTART — it doesn't move the sequence's current position. This forces
-- the very next nextval() to actually return 1001, whether or not the
-- sequence has already been drawn from.
ALTER SEQUENCE "public"."admission_number_seq" RESTART WITH 1001;