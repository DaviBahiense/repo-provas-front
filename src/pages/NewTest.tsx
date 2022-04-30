import {
  Box,
  Button,
  Divider,
  TextField,
  Autocomplete
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
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
          <FormDataTest list={list} token={token}/>
        </Box>
      </>
    );
}

function FormDataTest({list}:any, token:any) {

    const [loading, setLoading] = useState(false)
    
    const [formData, setFormData] = useState<any>({
        name: "",
        pdfUrl: "",
        category: "",
        discipline: "",
        teacher:""
    });

    const { setMessage } = useAlert();
    
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);

        if (!formData?.name ||
            !formData?.pdfUrl ||
            !formData?.category  ||
            !formData?.discipline ||
            !formData?.teacher) {
            setMessage({ type: "error", text: "Todos os campos são obrigatórios!" });
            return;
        } 
        const test:any = {
            name: formData.name,
            pdfUrl: formData.pdfUrl,
            categoryId: list.category.find((i: any) => 
                i.name === formData.category).id,
            teacherDisciplineId: list.teacher.find((i: any) =>
                i.name === formData.teacher).teacherDisciplines.find((i: any) =>
                i.disciplineId === list.discipline.find((i: any) =>
                i.name === formData.discipline).id).id
          }
          
        
        try {
            setLoading(true)
            await api.createTest(test, token)

            setLoading(false)
        } catch (error) {
            setMessage({ type: "error", text: "Ocorreu um erro após processamento" });
        }
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

    function handleAutoInput(name: string, value: any) {
       setFormData({ ...formData, [name]: value })
    }
    function handleInput(event: any) {
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
            onChange={handleInput}
            value={formData.name}
        />
        <TextField
            name="pdfUrl"
            sx={styles.input}
            label="Pdf da prova"
            onChange={handleInput}
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
            onInputChange={(e, value) => handleAutoInput("category", value)}
        />
        <Autocomplete
            className="discipline"
            sx={styles.input}
            autoComplete={true}
            options={list.discipline.map((e: any) => e.name)}
            renderInput={(e) =>
                <TextField
                {...e}
                label="Disciplina"
                size="medium"
                />}
            onInputChange={(e, value) => handleAutoInput("discipline", value)}
        />
        <Autocomplete
            className="teacher"
            sx={styles.input}
            autoComplete={true}
            disabled={formData.discipline? false : true}
            options={formData.discipline ? list.teacher.filter((i: any) =>
                i.teacherDisciplines.map((i: any) =>
                    i.disciplineId).includes(list.discipline.find((i: any) =>
                    i.name === formData.discipline).id)).map((i: any) =>
                    i.name)
                : [""]}
            renderInput={(e) =>
                <TextField
                {...e}
                label="Pessoa Instrutora"
                size="medium"
                />}
            onInputChange={(e, value) => handleAutoInput("teacher", value)}
        /> 
        <Box sx={styles.actionsContainer}>
            <Button variant="contained" type="submit" sx={{ width:"697px", height:"46px" }}>
            {loading ? "Carregando" : "Enviar" }
          </Button>
        </Box>
      </Box>
    </Form>
)
}

export default NewTest
  
