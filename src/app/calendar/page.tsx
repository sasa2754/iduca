import { Menu } from "@/src/components/menu";
import { CalendarComp } from "@/src/components/calendar";
import { List, ListItem } from "@mui/material";
import { Card } from "@/src/components/card";


const Calendar = () => {

    const eventos = [
        { title: "Reunião com o time", date: new Date(2025, 3, 23), type: 1 },
        { title: "Entrega do projeto", date: new Date(2025, 3, 30), type: 2 },
        { title: "Entrega final", date: new Date(2025, 4, 20), type: 3 },
        { title: "Entrega final 2", date: new Date(2025, 4, 20), type: 2 },
        { title: "Entrega final 2", date: new Date(2025, 4, 26), type: 1 },
        { title: "Entrega final 2", date: new Date(2025, 5, 13), type: 2 },
    ];

    return (
        <>
            <Menu></Menu>
            <div className="flex flex-col md:px-20 lg:px-40 px-2 py-10 gap-8">
                {/* Title */}
                <div className="flex flex-col gap-1 items-center p-1 md:items-start">
                    <h1 className="md:text-2xl text-xl font-bold text-(--text)">Calendário de Aulas</h1>
                    <p className="text-(--gray) text-sm md:text-lg text-center md:text-start">Veja seus próximos eventos e adicione lembretes!</p>
                </div>   

                {/* botão */}
                
                {/* Calendar */}
                <CalendarComp events={eventos}  />

                {/* Next events */}
                <div className="bg-(--card)  border border-(--stroke) shadow-(--shadow) rounded-2xl p-5">
                    <h1 className="font-bold text-xl text-(--text)">Próximos Eventos</h1>
                    <List className="max-h-[300px] overflow-auto pr-2">
                        {eventos
                        .filter((ev) => ev.date > new Date())
                        .sort((a, b) => a.date.getTime() - b.date.getTime())
                        .map((ev, i) => (
                            <ListItem key={i}>
                            <Card
                                title={ev.title}
                                description={ev.date.toLocaleDateString("pt-BR")}
                                color={
                                ev.type === 1
                                    ? "bg-[var(--purple)]"
                                    : ev.type === 2
                                    ? "bg-[var(--green)]"
                                    : "bg-[var(--yellow)]"
                                }
                                icon
                            />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </div>
        </>
    )
}

export default Calendar;