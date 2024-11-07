--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

-- Started on 2024-10-22 17:23:03

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 47614)
-- Name: comics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comics (
    id integer NOT NULL,
    publisher character varying(100),
    publisher_country character varying(100),
    title character varying(255),
    writers text,
    artists text,
    main_character character varying(100),
    side_characters text,
    story_arc character varying(255),
    comic_number integer,
    date_published date,
    number_of_pages integer,
    genre character varying(100)
);


ALTER TABLE public.comics OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 47613)
-- Name: comics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comics_id_seq OWNER TO postgres;

--
-- TOC entry 3325 (class 0 OID 0)
-- Dependencies: 214
-- Name: comics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comics_id_seq OWNED BY public.comics.id;


--
-- TOC entry 3173 (class 2604 OID 47617)
-- Name: comics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comics ALTER COLUMN id SET DEFAULT nextval('public.comics_id_seq'::regclass);


--
-- TOC entry 3319 (class 0 OID 47614)
-- Dependencies: 215
-- Data for Name: comics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comics (id, publisher, publisher_country, title, writers, artists, main_character, side_characters, story_arc, comic_number, date_published, number_of_pages, genre) FROM stdin;
1	Marvel	United States	The Amazing Spider-Man	Stan Lee, Steve Ditko	Steve Ditko (pencils), Dave Hunt (colors), John Romita (inks)	Spider-Man	Aunt May, Mary Jane Watson, J. Jonah Jameson	The Night Gwen Stacy Died	121	1973-06-01	22	Superhero
2	Marvel	United States	Spider-Man: Blue	Jeph Loeb	Tim Sale (pencils), Matt Hollingsworth (colors)	Spider-Man	Gwen Stacy, Mary Jane Watson	Spider-Man: Blue	1	2002-07-01	44	Superhero
3	Marvel	United States	Ultimate Spider-Man	Brian Michael Bendis	Mark Bagley (pencils), Art Thibert (inks), Steve buccellato (colors)	Spider-Man	Aunt May, Green Goblin, Mary Jane Watson, Ben Parker	Ultimate Power and Responsibility	1	2000-09-06	52	Superhero
4	Marvel	United States	The Amazing Spider-Man	Dan Slott	Humberto Ramos (pencils)	Spider-Man	Spider Girl, Lady Spider, Morlun	Spider-Verse	9	2014-12-01	40	Superhero
5	Marvel	United States	Spider-Man: Life Story	Chip Zdarsky	Mark Bagley (pencils), John Dell (inks)	Spider-Man	Captain America, Iron Man	Spider-Man: Life Story	1	2019-03-01	212	Superhero
6	DC Comics	United States	Batman: Year One	Frank Miller	David Mazzucchelli (pencils), Richmond Lewis (colors)	Batman	James Gordon, Catwoman	Year One	404	1988-06-16	108	Superhero
7	DC Comics	United States	Batman: The Long Halloween	Jeph Loeb	Tim Sale (pencils), Tim Sale (inks)	Batman	Harvey Dent, The Joker	The Long Halloween	1	1996-12-01	52	Superhero
8	DC Comics	United States	Batman: Hush	Jeph Loeb	Jim Lee (pencils), Scott Williams (inks)	Batman	Catwoman, Hush	Hush	1	2003-04-30	136	Superhero
9	DC Comics	United States	The Dark Knight Returns	Frank Miller	Frank Miller (pencils), Klaus Janson (inks), Lynn Varley (colors)	Batman	Robin, Joker, Superman	The Dark Knight Returns	1	1986-02-01	204	Superhero
10	DC Comics	United States	Batman: The Killing Joke	Alan Moore	Brian Bolland (pencils), John Higgins (colors)	Batman	The Joker, Barbara Gordon	The Killing Joke	1	1988-03-29	52	Superhero
\.


--
-- TOC entry 3326 (class 0 OID 0)
-- Dependencies: 214
-- Name: comics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comics_id_seq', 10, true);


--
-- TOC entry 3175 (class 2606 OID 47621)
-- Name: comics comics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comics
    ADD CONSTRAINT comics_pkey PRIMARY KEY (id);


-- Completed on 2024-10-22 17:23:03

--
-- PostgreSQL database dump complete
--

