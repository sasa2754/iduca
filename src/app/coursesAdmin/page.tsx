"use client";

import { Menu } from "@/src/components/menu";
import { FormControl, InputLabel, MenuItem, Pagination, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { CardCourse } from "@/src/components/cardCourse";
import { useDebounce } from "@/src/hooks/useDebounce";
import api from "@/src/constants/api";
import { headers } from "next/headers";
import { CuteButton } from "@/src/components/cuteButton";
import { ROUTES } from "@/src/constants/routes";
import { useRouter } from "next/navigation";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

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

const LEVELS = [
    { value: 1, label: "Iniciante" },
    { value: 2, label: "Intermediário" },
    { value: 3, label: "Avançado" },
];

const Courses = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [page, setPage] = useState(1);

    const [courses, setCourses] = useState<ICourse[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const router = useRouter();
    

    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
                if (category) params.append('category', category);
                if (difficulty) params.append('difficulty', difficulty);
                if (page) params.append('page', page.toString());

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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            }
        };
        fetchCategories();
    }, []);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <>
            <Menu/>
            <div className="flex flex-col md:px-20 lg:px-40 px-2 py-10 gap-8">
                <div className="flex flex-row justify-between items-center p-1 md:items-start">
                    <div className="flex-col gap-1">
                        <h1 className="md:text-2xl text-xl font-bold text-(--text)">Catálogo de Cursos</h1>
                        <p className="text-(--gray) text-sm md:text-lg text-center md:text-start">Gerencie e adicione novos treinamentos para a plataforma!</p>
                    </div>
                    <CuteButton 
                        text="Criar novo curso" 
                        icon={AddCircleOutlineOutlinedIcon}
                        onClick={() => router.push(ROUTES.addCourse)}
                    />
                </div>

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
                            <p>Carregando cursos...</p>
                        ) : (
                            <div className="grid grid-cols-1 place-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6 gap-4">
                                {courses.map(course => (
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
                                ))}
                            </div>
                        )}
                        {totalPages > 1 && (
                            <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Courses;