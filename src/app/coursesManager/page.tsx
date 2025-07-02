"use client";

import { Menu } from "@/src/components/menu";
import { 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Pagination, 
    Select, 
    TextField,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Autocomplete,
    CircularProgress,
    Snackbar
} from "@mui/material";
import { useState, useEffect } from "react";
import { CardCourse } from "@/src/components/cardCourse";
import { CuteButton } from "@/src/components/cuteButton";
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import { NotifyModal } from "@/src/components/notifyModal";
import { useDebounce } from "@/src/hooks/useDebounce";
import api from "@/src/constants/api";

// --- INTERFACES PARA OS DADOS ---

interface ICourse {
    id: string;
    title: string;
    image: string;
    progress: number;
    description: string;
    rating: number;
    participants: number;
    difficulty: number;
}

interface ICategory {
    id: number;
    name: string;
}

interface ITeamMember {
    id: string;
    name: string;
}

const LEVELS = [
    { value: 1, label: "Iniciante" },
    { value: 2, label: "Intermediário" },
    { value: 3, label: "Avançado" },
];

const CoursesManager = () => {
    // --- ESTADOS PARA FILTROS E PAGINAÇÃO ---
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [page, setPage] = useState(1);

    // --- ESTADOS PARA DADOS DA API ---
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [team, setTeam] = useState<ITeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- ESTADOS PARA O MODAL DE INSCRIÇÃO ---
    const [openModal, setOpenModal] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // --- ESTADO PARA O SNACKBAR DE FEEDBACK ---
    const [snackbar, setSnackbar] = useState({ open: false, message: "" });

    // Hook de debounce para a busca
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // --- LÓGICA DE BUSCA DE DADOS ---
    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams({ page: page.toString() });
                if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
                if (category) params.append('category', category);
                if (difficulty) params.append('difficulty', difficulty);

                const response = await api.get('/courses', { params });
                setCourses(response.data.courses);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Erro ao buscar cursos:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, [debouncedSearchTerm, category, difficulty, page]);

    // Busca os dados para os filtros e para o modal apenas uma vez
    useEffect(() => {
        api.get('/categories').then(response => setCategories(response.data)).catch(err => console.error(err));
        api.get('/manager/team').then(response => setTeam(response.data)).catch(err => console.error(err));
    }, []);

    // --- LÓGICA DO MODAL ---
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedEmployeeId(null);
        setSelectedCourseId(null);
    };

    const handleEnrollSubmit = async () => {
        if (!selectedEmployeeId || !selectedCourseId) {
            setSnackbar({ open: true, message: "Por favor, selecione um colaborador e um curso." });
            return;
        }
        setIsSubmitting(true);
        try {
            await api.post('/manager/enroll', {
                employeeId: selectedEmployeeId,
                courseId: selectedCourseId
            });
            setSnackbar({ open: true, message: "Colaborador inscrito com sucesso!" });
            handleCloseModal();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Erro ao inscrever colaborador.";
            setSnackbar({ open: true, message: errorMessage });
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <>
            <Menu />
            <div className="flex flex-col md:px-20 lg:px-40 px-2 py-10 gap-8">
                {/* Title e Botão de Inscrição */}
                <div className="flex flex-row justify-between items-center p-1 md:items-start">
                    <div className="flex-col gap-1">
                        <h1 className="md:text-2xl text-xl font-bold text-(--text)">Catálogo de Cursos</h1>
                        <p className="text-(--gray) text-sm md:text-lg text-center md:text-start">Explore os treinamentos disponíveis e inscreva seu time!</p>
                    </div>
                    <CuteButton 
                        text="Inscrever Colaborador" 
                        icon={PersonAddAlt1OutlinedIcon}
                        onClick={handleOpenModal}
                    />
                </div>

                {/* Modal para inscrever colaborador */}
                <NotifyModal title="Inscrever Colaborador em Curso" open={openModal} onClose={handleCloseModal}>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: '10px' }}>
                            <Autocomplete
                                options={team}
                                getOptionLabel={(option) => `${option.name} (${option.id})`}
                                onChange={(event, newValue) => setSelectedEmployeeId(newValue?.id || null)}
                                renderInput={(params) => <TextField {...params} label="Selecione o Colaborador" />}
                                noOptionsText="Nenhum colaborador encontrado"
                            />
                             <Autocomplete
                                options={courses}
                                getOptionLabel={(option) => option.title}
                                onChange={(event, newValue) => setSelectedCourseId(newValue?.id || null)}
                                renderInput={(params) => <TextField {...params} label="Selecione o Curso" />}
                                noOptionsText="Nenhum curso encontrado"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ padding: '16px 24px' }}>
                        <Button onClick={handleCloseModal}>Cancelar</Button>
                        <Button 
                            onClick={handleEnrollSubmit} 
                            color="primary"
                            variant="contained"
                            disabled={isSubmitting || !selectedEmployeeId || !selectedCourseId}
                        >
                            {isSubmitting ? "Inscrevendo..." : "Inscrever"}
                        </Button>
                    </DialogActions>
                </NotifyModal>

                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                    <TextField
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        label="Buscar por título..."
                        variant="outlined"
                        sx={{ backgroundColor: "var(--card)" }}
                        className="md:col-span-2"
                    />
                    <FormControl fullWidth sx={{ backgroundColor: "var(--card)" }}>
                        <InputLabel>Categoria</InputLabel>
                        <Select value={category} label="Categoria" onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
                            <MenuItem value=""><em>Todas</em></MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.name}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ backgroundColor: "var(--card)" }}>
                        <InputLabel>Nível</InputLabel>
                        <Select value={difficulty} label="Nível" onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}>
                            <MenuItem value=""><em>Todos</em></MenuItem>
                            {LEVELS.map((lvl) => (
                                <MenuItem key={lvl.value} value={lvl.value.toString()}>
                                    {lvl.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                {/* Grid de Cursos e Paginação */}
                <div>
                    <div className="flex flex-col gap-10 items-center">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <CircularProgress />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 place-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6 gap-4">
                                {courses.length > 0 ? courses.map(course => (
                                    <CardCourse
                                        key={course.id}
                                        id={course.id}
                                        image={course.image}
                                        title={course.title}
                                        description={course.description}
                                        progress={course.progress}
                                        rating={course.rating}
                                        participants={course.participants}
                                        difficulty={course.difficulty}
                                    />
                                )) : (
                                    <p className="text-(--gray) col-span-full">Nenhum curso encontrado com os filtros selecionados.</p>
                                )}
                            </div>
                        )}
                        {totalPages > 1 && !isLoading && (
                            <Pagination count={totalPages} page={page} onChange={(e, val) => setPage(val)} color="primary" />
                        )}
                    </div>
                </div>
            </div>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            />
        </>
    )
}

export default CoursesManager;