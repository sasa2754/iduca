"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Button, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    TextField, 
    InputAdornment, 
    DialogContent, 
    Box, 
    DialogActions,
    Checkbox,
    FormControlLabel,
    CircularProgress,
    Snackbar
} from "@mui/material";
import { 
    InfoOutlined,
    SearchOutlined,
    ArrowUpward,
    ArrowDownward,
    DownloadOutlined,
    PersonAddAlt1Outlined
} from '@mui/icons-material';
import { Menu } from "@/src/components/menu";
import { CuteButton } from "@/src/components/cuteButton";
import { NotifyModal } from "@/src/components/notifyModal";
import { ROUTES } from "@/src/constants/routes";
import api from '@/src/constants/api';


// Interface para os dados que esperamos da API
interface ICollaborator {
  id: string;
  employeeId: string; // Adicionado para exibir o ID do funcionário
  name: string;
  email: string;
  isManager: boolean;
  coursesCompleted: number;
  coursesInProgress: number;
  averageScore: number;
  topCategory: string;
}

const Collaborators = () => {
  const router = useRouter();

  // --- ESTADOS PARA OS DADOS E UI ---
  const [collaborators, setCollaborators] = useState<ICollaborator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- ESTADOS PARA FILTRO, ORDENAÇÃO E MODAL ---
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof ICollaborator; direction: 'ascending' | 'descending' } | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [newCollaborator, setNewCollaborator] = useState({ employeeId: '', name: '', email: '', isManager: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  // --- LÓGICA DE BUSCA DE DADOS ---
  const fetchCollaborators = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const response = await api.get('/manager/employeesSummary');
        setCollaborators(response.data);
    } catch (err) {
        console.error("Erro ao buscar colaboradores:", err);
        setError("Não foi possível carregar os dados da equipe.");
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborators();
  }, []);

  // --- LÓGICA DO MODAL DE CADASTRO ---
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewCollaborator({ employeeId: '', name: '', email: '', isManager: false });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewCollaborator(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleSubmit = async () => {
    if (!newCollaborator.employeeId || !newCollaborator.name || !newCollaborator.email) {
      setSnackbar({ open: true, message: "Preencha todos os campos obrigatórios." });
      return;
    }
    setIsSubmitting(true);
    try {
        await api.post('/user', newCollaborator);
        setSnackbar({ open: true, message: "Colaborador cadastrado com sucesso!" });
        handleCloseModal();
        fetchCollaborators();
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao cadastrar colaborador.";
        setSnackbar({ open: true, message: errorMessage });
        console.error("Erro no cadastro:", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- LÓGICA DE FILTRO E ORDENAÇÃO ---
  const requestSort = (key: keyof ICollaborator) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedCollaborators = useMemo(() => {
    let filtered = collaborators.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [collaborators, searchTerm, sortConfig]);

  const getSortIcon = (key: keyof ICollaborator) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' 
      ? <ArrowUpward fontSize="small" /> 
      : <ArrowDownward fontSize="small" />;
  };

  return (
    <>
      <Menu />
      <div className="flex flex-col md:px-20 lg:px-40 px-2 py-10 gap-8">
        {/* Cabeçalho */}
        <div className="flex flex-row justify-between items-center p-1 md:items-start">
          <div className="flex-col gap-1">
            <h1 className="md:text-2xl text-xl font-bold text-(--text)">Colaboradores</h1>
            <p className="text-(--gray) text-sm md:text-lg text-center md:text-start">
              Acompanhe o desenvolvimento dos seus colaboradores!
            </p>
          </div>
          <div className="flex gap-2">
            <CuteButton text="Cadastrar funcionário" icon={PersonAddAlt1Outlined} onClick={handleOpenModal} />
            <CuteButton text="Exporte o relatório" icon={DownloadOutlined} onClick={() => alert('Função de exportar a ser implementada!')} />
          </div>
        </div>

        {/* Modal de cadastro */}
        <NotifyModal title="Cadastrar Novo Colaborador" open={openModal} onClose={handleCloseModal}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '20px 0' }}>
              <TextField name="employeeId" label="ID do Funcionário *" variant="outlined" fullWidth value={newCollaborator.employeeId} onChange={handleInputChange} />
              <TextField name="name" label="Nome Completo *" variant="outlined" fullWidth value={newCollaborator.name} onChange={handleInputChange} />
              <TextField name="email" label="Email Corporativo *" variant="outlined" fullWidth value={newCollaborator.email} onChange={handleInputChange} type="email" />
              <FormControlLabel control={ <Checkbox name="isManager" checked={newCollaborator.isManager} onChange={handleInputChange} color="primary" /> } label="É gestor?" />
              <small style={{ color: 'gray' }}>* Campos obrigatórios</small>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancelar</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained" disabled={isSubmitting || !newCollaborator.employeeId || !newCollaborator.name || !newCollaborator.email}>
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </DialogActions>
        </NotifyModal>

        {/* Barra de pesquisa */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Pesquisar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: ( <InputAdornment position="start"><SearchOutlined /></InputAdornment> ) }}
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />

        {/* Tabela */}
        <TableContainer className="bg-(--card) border border-(--stroke) shadow-(--shadow) rounded-2xl">
          <Table>
            <TableHead>
              <TableRow>
                {/* AQUI ESTÁ SEU CABEÇALHO COMPLETO E FUNCIONAL */}
                {(['name', 'email', 'coursesCompleted', 'coursesInProgress', 'averageScore', 'topCategory'] as const).map((key) => (
                  <TableCell 
                    key={key} 
                    align="center" 
                    onClick={() => requestSort(key)}
                    sx={{ cursor: 'pointer', fontWeight: 'bold', color: 'var(--text)' }}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {{
                        id: 'ID',
                        name: 'Nome',
                        email: 'Email',
                        coursesCompleted: 'Cursos Completos',
                        coursesInProgress: 'Cursos em Andamento',
                        averageScore: 'Score Médio',
                        topCategory: 'Categoria Destaque'
                      }[key]}
                      {getSortIcon(key)}
                    </div>
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontWeight: 'bold', color: 'var(--text)' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={8} align="center"><CircularProgress /></TableCell></TableRow>
              ) : error ? (
                <TableRow><TableCell colSpan={8} align="center" sx={{ color: 'red' }}>{error}</TableCell></TableRow>
              ) : (
                sortedCollaborators.map((row) => (
                  <TableRow key={row.id} className="hover:bg-(--hoverWhite) transition duration-150" sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.email}</TableCell>
                    <TableCell align="center">{row.coursesCompleted}</TableCell>
                    <TableCell align="center">{row.coursesInProgress}</TableCell>
                    <TableCell align="center">{row.averageScore.toFixed(1)}</TableCell>
                    <TableCell align="center">{row.topCategory}</TableCell>
                    <TableCell align="center">
                      <Button onClick={() => router.push(`/collaborators/${row.id}`)}>
                        <InfoOutlined />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({...snackbar, open: false})} message={snackbar.message} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} />
    </>
  );
};

export default Collaborators;