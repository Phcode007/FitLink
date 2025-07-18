--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

-- Started on 2025-06-30 21:03:33

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

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4960 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16561)
-- Name: Clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Clientes" (
    "ID" integer NOT NULL,
    "Nome" character varying(255) NOT NULL,
    "Sexo" character varying(255) NOT NULL,
    "Idade" date NOT NULL,
    "Endereço" character varying(255) NOT NULL,
    "Telefone" character varying(255) NOT NULL,
    "Email" character varying(255) NOT NULL,
    "Turno" character varying(255) NOT NULL,
    "Senha_hash" text NOT NULL,
    "Foto" bytea,
    "Data_cadastro" date NOT NULL,
    "Observacao" text,
    "Data_Nascimento" date,
    "Altura" numeric,
    "Meta" character varying(255)
);


ALTER TABLE public."Clientes" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16560)
-- Name: Clientes_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Clientes" ALTER COLUMN "ID" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."Clientes_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 226 (class 1259 OID 24810)
-- Name: Conexoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Conexoes" (
    "ID" integer NOT NULL,
    "Cliente_ID" integer,
    "Personal_ID" integer,
    "Nutricionista_ID" integer,
    "Data_Conexao" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "Status" character varying(20) DEFAULT 'pendente'::character varying
);


ALTER TABLE public."Conexoes" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24809)
-- Name: Conexoes_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Conexoes_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Conexoes_ID_seq" OWNER TO postgres;

--
-- TOC entry 4961 (class 0 OID 0)
-- Dependencies: 225
-- Name: Conexoes_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Conexoes_ID_seq" OWNED BY public."Conexoes"."ID";


--
-- TOC entry 224 (class 1259 OID 16569)
-- Name: Consultas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Consultas" (
    "ID" integer NOT NULL,
    "Data_consulta" date NOT NULL,
    "Peso" numeric,
    "Altura" numeric,
    "IMC" numeric,
    "Cintura" numeric,
    "Quadril" numeric,
    "Observacao" text,
    "Fotos" bytea,
    "Prontuario" bytea,
    "Consulta_Agendada" date,
    "ID_Paciente" integer NOT NULL,
    "ID_Nutricionista" integer NOT NULL,
    "ID_Personal" integer NOT NULL,
    "ID_Treinos" integer NOT NULL,
    "Data_Consulta" integer
);


ALTER TABLE public."Consultas" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16568)
-- Name: Consultas_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Consultas" ALTER COLUMN "ID" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."Consultas_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 218 (class 1259 OID 16545)
-- Name: Nutricionistas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Nutricionistas" (
    "ID" integer NOT NULL,
    "Nome" character varying(255) NOT NULL,
    "Idade" date NOT NULL,
    "Endereço" character varying(255) NOT NULL,
    "Telefone" character varying(255) NOT NULL,
    "Email" character varying(255) NOT NULL,
    "CRN" character varying(255) NOT NULL,
    "Senha_hash" text NOT NULL,
    "Foto" bytea NOT NULL,
    "Data_cadastro" date NOT NULL
);


ALTER TABLE public."Nutricionistas" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16544)
-- Name: Nutricionistas_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Nutricionistas" ALTER COLUMN "ID" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."Nutricionistas_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 16553)
-- Name: Personal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Personal" (
    "ID" integer NOT NULL,
    "Nome" character varying(255) NOT NULL,
    "Idade" date NOT NULL,
    "Endereço" character varying(255) NOT NULL,
    "Telefone" character varying(255) NOT NULL,
    "Email" character varying(255) NOT NULL,
    "CREF" character varying(255) NOT NULL,
    "Senha_hash" text NOT NULL,
    "Foto" bytea NOT NULL,
    "Data_cadastro" date NOT NULL
);


ALTER TABLE public."Personal" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16552)
-- Name: Personal_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Personal" ALTER COLUMN "ID" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."Personal_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 228 (class 1259 OID 33002)
-- Name: Planos_Alimentares; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Planos_Alimentares" (
    "ID" integer NOT NULL,
    "Nome" character varying(255) NOT NULL,
    "Objetivo" character varying(255) NOT NULL,
    "Descricao" text,
    "ID_Paciente" integer NOT NULL,
    "ID_Nutricionista" integer NOT NULL,
    "Data_Criacao" date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public."Planos_Alimentares" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 33001)
-- Name: Planos_Alimentares_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Planos_Alimentares_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Planos_Alimentares_ID_seq" OWNER TO postgres;

--
-- TOC entry 4962 (class 0 OID 0)
-- Dependencies: 227
-- Name: Planos_Alimentares_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Planos_Alimentares_ID_seq" OWNED BY public."Planos_Alimentares"."ID";


--
-- TOC entry 216 (class 1259 OID 16531)
-- Name: Treinos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Treinos" (
    "ID" integer NOT NULL,
    "Data_Treino" date NOT NULL,
    "Exercicios" text,
    "Observacao" text,
    "ID_Paciente" integer NOT NULL,
    "ID_Personal" integer NOT NULL,
    "Completo" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Treinos" OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16530)
-- Name: Treinos_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Treinos" ALTER COLUMN "ID" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."Treinos_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4766 (class 2604 OID 24813)
-- Name: Conexoes ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Conexoes" ALTER COLUMN "ID" SET DEFAULT nextval('public."Conexoes_ID_seq"'::regclass);


--
-- TOC entry 4769 (class 2604 OID 33005)
-- Name: Planos_Alimentares ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Planos_Alimentares" ALTER COLUMN "ID" SET DEFAULT nextval('public."Planos_Alimentares_ID_seq"'::regclass);


--
-- TOC entry 4784 (class 2606 OID 16567)
-- Name: Clientes Clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Clientes"
    ADD CONSTRAINT "Clientes_pkey" PRIMARY KEY ("ID");


--
-- TOC entry 4798 (class 2606 OID 24817)
-- Name: Conexoes Conexoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Conexoes"
    ADD CONSTRAINT "Conexoes_pkey" PRIMARY KEY ("ID");


--
-- TOC entry 4786 (class 2606 OID 16581)
-- Name: Consultas Consultas_ID_Nutricionista_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Consultas"
    ADD CONSTRAINT "Consultas_ID_Nutricionista_key" UNIQUE ("ID_Nutricionista");


--
-- TOC entry 4788 (class 2606 OID 16579)
-- Name: Consultas Consultas_ID_Paciente_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Consultas"
    ADD CONSTRAINT "Consultas_ID_Paciente_key" UNIQUE ("ID_Paciente");


--
-- TOC entry 4790 (class 2606 OID 16583)
-- Name: Consultas Consultas_ID_Personal_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Consultas"
    ADD CONSTRAINT "Consultas_ID_Personal_key" UNIQUE ("ID_Personal");


--
-- TOC entry 4792 (class 2606 OID 16585)
-- Name: Consultas Consultas_ID_Treinos_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Consultas"
    ADD CONSTRAINT "Consultas_ID_Treinos_key" UNIQUE ("ID_Treinos");


--
-- TOC entry 4794 (class 2606 OID 16577)
-- Name: Consultas Consultas_ID_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Consultas"
    ADD CONSTRAINT "Consultas_ID_key" UNIQUE ("ID");


--
-- TOC entry 4796 (class 2606 OID 16575)
-- Name: Consultas Consultas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Consultas"
    ADD CONSTRAINT "Consultas_pkey" PRIMARY KEY ("ID", "ID_Paciente", "ID_Nutricionista", "ID_Personal", "ID_Treinos");


--
-- TOC entry 4780 (class 2606 OID 16551)
-- Name: Nutricionistas Nutricionistas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Nutricionistas"
    ADD CONSTRAINT "Nutricionistas_pkey" PRIMARY KEY ("ID");


--
-- TOC entry 4782 (class 2606 OID 16559)
-- Name: Personal Personal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Personal"
    ADD CONSTRAINT "Personal_pkey" PRIMARY KEY ("ID");


--
-- TOC entry 4800 (class 2606 OID 33010)
-- Name: Planos_Alimentares Planos_Alimentares_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Planos_Alimentares"
    ADD CONSTRAINT "Planos_Alimentares_pkey" PRIMARY KEY ("ID");


--
-- TOC entry 4772 (class 2606 OID 16541)
-- Name: Treinos Treinos_ID_Paciente_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Treinos"
    ADD CONSTRAINT "Treinos_ID_Paciente_key" UNIQUE ("ID_Paciente");


--
-- TOC entry 4774 (class 2606 OID 16543)
-- Name: Treinos Treinos_ID_Personal_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Treinos"
    ADD CONSTRAINT "Treinos_ID_Personal_key" UNIQUE ("ID_Personal");


--
-- TOC entry 4776 (class 2606 OID 16539)
-- Name: Treinos Treinos_ID_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Treinos"
    ADD CONSTRAINT "Treinos_ID_key" UNIQUE ("ID");


--
-- TOC entry 4778 (class 2606 OID 16537)
-- Name: Treinos Treinos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Treinos"
    ADD CONSTRAINT "Treinos_pkey" PRIMARY KEY ("ID", "ID_Paciente", "ID_Personal");


--
-- TOC entry 4807 (class 2606 OID 24818)
-- Name: Conexoes Conexoes_Cliente_ID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Conexoes"
    ADD CONSTRAINT "Conexoes_Cliente_ID_fkey" FOREIGN KEY ("Cliente_ID") REFERENCES public."Clientes"("ID");


--
-- TOC entry 4808 (class 2606 OID 24828)
-- Name: Conexoes Conexoes_Nutricionista_ID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Conexoes"
    ADD CONSTRAINT "Conexoes_Nutricionista_ID_fkey" FOREIGN KEY ("Nutricionista_ID") REFERENCES public."Nutricionistas"("ID");


--
-- TOC entry 4809 (class 2606 OID 24823)
-- Name: Conexoes Conexoes_Personal_ID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Conexoes"
    ADD CONSTRAINT "Conexoes_Personal_ID_fkey" FOREIGN KEY ("Personal_ID") REFERENCES public."Personal"("ID");


--
-- TOC entry 4803 (class 2606 OID 16627)
-- Name: Consultas Consultas_ID_Nutricionista_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Consultas"
    ADD CONSTRAINT "Consultas_ID_Nutricionista_fkey" FOREIGN KEY ("ID_Nutricionista") REFERENCES public."Nutricionistas"("ID");


--
-- TOC entry 4804 (class 2606 OID 16617)
-- Name: Consultas Consultas_ID_Paciente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Consultas"
    ADD CONSTRAINT "Consultas_ID_Paciente_fkey" FOREIGN KEY ("ID_Paciente") REFERENCES public."Clientes"("ID");


--
-- TOC entry 4805 (class 2606 OID 16632)
-- Name: Consultas Consultas_ID_Personal_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Consultas"
    ADD CONSTRAINT "Consultas_ID_Personal_fkey" FOREIGN KEY ("ID_Personal") REFERENCES public."Personal"("ID");


--
-- TOC entry 4806 (class 2606 OID 16642)
-- Name: Consultas Consultas_ID_Treinos_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Consultas"
    ADD CONSTRAINT "Consultas_ID_Treinos_fkey" FOREIGN KEY ("ID_Treinos") REFERENCES public."Treinos"("ID");


--
-- TOC entry 4810 (class 2606 OID 33016)
-- Name: Planos_Alimentares Planos_Alimentares_ID_Nutricionista_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Planos_Alimentares"
    ADD CONSTRAINT "Planos_Alimentares_ID_Nutricionista_fkey" FOREIGN KEY ("ID_Nutricionista") REFERENCES public."Nutricionistas"("ID");


--
-- TOC entry 4811 (class 2606 OID 33011)
-- Name: Planos_Alimentares Planos_Alimentares_ID_Paciente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Planos_Alimentares"
    ADD CONSTRAINT "Planos_Alimentares_ID_Paciente_fkey" FOREIGN KEY ("ID_Paciente") REFERENCES public."Clientes"("ID");


--
-- TOC entry 4801 (class 2606 OID 16622)
-- Name: Treinos Treinos_ID_Paciente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Treinos"
    ADD CONSTRAINT "Treinos_ID_Paciente_fkey" FOREIGN KEY ("ID_Paciente") REFERENCES public."Clientes"("ID");


--
-- TOC entry 4802 (class 2606 OID 16637)
-- Name: Treinos Treinos_ID_Personal_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Treinos"
    ADD CONSTRAINT "Treinos_ID_Personal_fkey" FOREIGN KEY ("ID_Personal") REFERENCES public."Personal"("ID");


-- Completed on 2025-06-30 21:03:34

--
-- PostgreSQL database dump complete
--

