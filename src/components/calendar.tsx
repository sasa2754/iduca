"use client";

import { useEffect, useState } from "react";
import { IconButton, List, ListItem } from "@mui/material";
import {
  StaticDatePicker,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import { Card } from "./card";
import { isSameDay } from "date-fns";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';

export interface ICalendar {
  title: string;
  date: Date;
  type: number;
}

interface CalendarProps {
  events: ICalendar[];
}

export const CalendarComp = ({ events }: CalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const eventosDoDia = events.filter(
    (ev) => selectedDate && isSameDay(ev.date, selectedDate)
  );

    const eventTypesByDate = new Map<string, number>();

    events.forEach((ev) => {
      eventTypesByDate.set(ev.date.toDateString(), ev.type);
    });

  const CustomDay = ( props: PickersDayProps & { eventTypesByDate: Map<string, number> } ) => {
    const { day, eventTypesByDate, ...other } = props;
    const dateKey = day ? day.toDateString() : "";
    const eventType = eventTypesByDate.get(dateKey);

    const colorClass = eventType === 1
      ? "bg-[var(--purple)]"
      : eventType === 2
      ? "bg-[var(--green)]"
      : eventType === 3
      ? "bg-[var(--yellow)]"
      : "";

    return (
      <div className="relative">
        <PickersDay day={day} {...other} />
        {eventType && (
          <div className={`absolute bottom-[6px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${colorClass}`} />
        )}
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <div className="flex lg:flex-row flex-col w-full justify-between gap-3 items-center">
        <div className="bg-(--card) border border-(--stroke) shadow-[var(--shadow)] rounded-2xl p-2 max-w-96">
          <StaticDatePicker
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            displayStaticWrapperAs="desktop"
            slots={{
              day: (props) => <CustomDay {...props} eventTypesByDate={eventTypesByDate} />,
            }}
            slotProps={{
              actionBar: { actions: [] },
              nextIconButton: {
                sx: { color: "var(--text)" }
              },
              previousIconButton: {
                sx: { color: "var(--text)" }
              },
              switchViewIcon: {
                sx: { fill: "var(--text)" }
              }
            }}
            sx={{
              backgroundColor: 'var(--card)',
              borderRadius: '12px',
              '.MuiPickersCalendarHeader-root': {
                color: 'var(--text)',
              },
              '.MuiDayCalendar-weekDayLabel': {
                color: 'var(--text)',
              },
              '.MuiPickersDay-root': {
                color: 'var(--text)',
              },
              '.Mui-selected': {
                backgroundColor: 'var(--purple)',
                color: 'var(--text)',
                '&:hover': {
                  backgroundColor: 'var(--purple)',
                },
              },
              '.MuiPickersDay-root:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
              '.MuiYearCalendar-root button, .MuiMonthCalendar-root button': {
                color: 'var(--text)',
              },
              '.MuiYearCalendar-root .Mui-selected, .MuiMonthCalendar-root .Mui-selected': {
                backgroundColor: 'var(--purple)',
                color: 'var(--text)',
              },
              '.MuiYearCalendar-root button:hover, .MuiMonthCalendar-root button:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          />
        </div>
        <div className="bg-(--card) border border-(--stroke) shadow-[var(--shadow)] rounded-2xl w-full p-5 h-[352px]">
          <h1 className="font-bold text-xl text-(--text)">Eventos</h1>
          {eventosDoDia.length > 0 ? (
            <List className="max-h-[290px] overflow-auto pr-2">
              {eventosDoDia.map((ev, i) => (
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
          ) : (
            <h1 className="text-(--gray)">Nenhum evento encontrado!</h1>
          )}
        </div>
      </div>
    </LocalizationProvider>
  );
};
