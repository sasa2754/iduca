import { Menu } from "@/src/components/menu";
import { CollaboratorClient } from "@/src/components/CollaboratorClient"; // Importa nosso novo componente
import { cookies } from 'next/headers';
import { ClientOnly } from "@/src/components/ClientOnly";
import { BackButton } from "@/src/components/backButton";

type PageProps = {
  params: {
    id: string;
  };
};

// Função para buscar os dados do colaborador no servidor
async function getCollaboratorData(employeeId: string) {
    const tokenCookie = (await cookies()).get('auth_token');
    if (!tokenCookie) throw new Error("Usuário não autenticado");

    const headers = { 'Authorization': `Bearer ${tokenCookie.value}` };
    const baseUrl = process.env.BACKEND_API_URL;
    
    // O endpoint que já fizemos no backend
    const apiUrl = `${baseUrl}/manager/employee/${employeeId}/dashboard`;
    const res = await fetch(apiUrl, { headers, cache: 'no-store' });

    if (!res.ok) {
        throw new Error(`Falha ao buscar dados do colaborador. Status: ${res.status}`);
    }

    return res.json();
}

const CollaboratorPage = async ({ params }: PageProps) => {
  const { id: employeeId } = params;

  let collaboratorData;
  try {
    collaboratorData = await getCollaboratorData(employeeId);
  } catch (error) {
    console.error("ERRO AO CARREGAR PÁGINA DO COLABORADOR:", error);
    return (
      <>
        <ClientOnly>
          <Menu />
        </ClientOnly>
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-xl text-red-500">Erro ao carregar dados</h1>
            <p className="text-(--gray)">Não foi possível buscar as informações deste colaborador.</p>
            <BackButton />
        </div>
      </>
    );
  }

  return (
    <>
      <ClientOnly>
        <Menu />
      </ClientOnly>
      
      <CollaboratorClient initialData={collaboratorData} />
    </>
  );
};

export default CollaboratorPage;