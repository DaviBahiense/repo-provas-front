import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Link,
  TextField,
  Typography,
  Autocomplete
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api, {
  Category,
  Discipline,
  TeacherDisciplines,
  Test,
  TestByDiscipline,
} from "../services/api";
import Form from "../components/Form";
import useAlert from "../hooks/useAlert";

function NewTest() {
    const navigate = useNavigate();
    const { token } = useAuth();
    
    const [list, setList] = useState<any>({
        discipline: [],
        teacher: [],
        category: []
    })

    async function getList(token: string) {
        const arrTeachers = await api.getTeachers(token);
        const arrCategories = await api.getCategories(token);
        const arrDisciplines = await api.getDisciplines(token);

        setList({
            discipline: arrDisciplines.data,
            teacher: arrTeachers.data,
            category: arrCategories.data.categories,
          })
    }
  
    useEffect(() => {
      async function loadPage() {
        if (!token) return;
        getList(token)
      }
      loadPage();
    }, [token]); 
  
    return (
      <>
        <TextField
          sx={{ marginX: "auto", marginBottom: "25px", width: "450px" }}
          label="Pesquise por pessoa instrutora"
        />
        <Divider sx={{ marginBottom: "35px" }} />
        <Box
          sx={{
            marginX: "auto",
            width: "700px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/app/disciplinas")}
            >
              Disciplinas
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/app/pessoas-instrutoras")}
            >
              Pessoa Instrutora
            </Button>
            <Button variant="contained" onClick={() => navigate("/app/adicionar")}>
              Adicionar
            </Button>
          </Box>
          <FormDataTest list={list}/>
        </Box>
      </>
    );
}

function FormDataTest({list}:any) {
    
    const [formData, setFormData] = useState<FormData>({
        name: "",
        pdfUrl: "",
        category: "",
        discipline: "",
        teacher:""
    });
    interface FormData {
        name: string;
        pdfUrl: string;
        category: string;
        discipline: string;
        teacher: string;
    }

    const { setMessage } = useAlert();

    function handleInputChange(e: any) {

        if (e.target.name === "pdfUrl" || e.target.name === "name"){setFormData({ ...formData, [e.target.name]: e.target.value });}
        else if (e.target.className ){setFormData({ ...formData, [e.target.className]: e.target.innerText });}
        console.log("e.target.name:", e.target.name) 
        console.log("e.target.innerText:", e.target.innerText)
        
    }
    
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);
    
        /* if (!formData?.name || !formData?.pdfUrl || formData?.categoryId === 0 || formData?.teacherDisciplineId === 0) {
          setMessage({ type: "error", text: "Todos os campos são obrigatórios!" });
          return;
        } */
       // const { name, pdfUrl, categoryId, teacherDisciplineId } = formData;
    }

    const styles = {
        container: { 
          width: "697px",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        },
        title: { marginBottom: "30px" },
        dividerContainer: {
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "16px",
          marginBottom: "26px",
        },
        input: { marginBottom: "16px" },
        actionsContainer: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
    };

    function textFieldInput(name: string, value: any) {
       setFormData({ ...formData, [name]: value })
    }

    function handleFreeFormInput(event: any) {
       setFormData({ ...formData, [event.target.name]: event.target.value })
    }
    
    return(

    <Form onSubmit={handleSubmit}>
      <Box sx={styles.container}>
        <TextField
          name="name"
          sx={styles.input}
          label="Título da Prova"
          type="text"
          variant="outlined"
          onChange={handleInputChange}
          value={formData.name}
        />
        <TextField
          name="pdfUrl"
          sx={styles.input}
          label="Pdf da prova"
          onChange={handleInputChange}
          value={formData.pdfUrl}
        />
         <Autocomplete
          className="category"
          sx={styles.input}
          autoComplete={true}
          options={list.category.map((e: any) => e.name)}
          isOptionEqualToValue={(option, value) => option === value}
          renderInput={(e) =>
            <TextField
              {...e}
              label="Categoria"
              size="medium"
            />}
          onInputChange={( event)=>handleInputChange( event)}
        />
        <Autocomplete
          className="discipline"
          sx={styles.input}
          autoComplete={true}
          options={list.teacher.map((e: any) => e.name)}
          renderInput={(e) =>
            <TextField
              {...e}
              label="Categoria"
              size="medium"
            />}
          onInputChange={()=>handleInputChange}
        />
        <Autocomplete
          className="teacher"
          sx={styles.input}
          autoComplete={true}
          options={list.discipline.map((e: any) => e.name)}
          renderInput={(e) =>
            <TextField
              {...e}
              label="Categoria"
              size="medium"
            />}
          onInputChange={()=>handleInputChange}
        /> 
        <Box sx={styles.actionsContainer}>
          <Button variant="contained" type="submit">
            Enviar
          </Button>
        </Box>
      </Box>
    </Form>
)
}

export default NewTest
  
