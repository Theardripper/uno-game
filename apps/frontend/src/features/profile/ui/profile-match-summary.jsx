import React from "react";

function SummaryBlock({ title, value, highlight, colSpan }) {
    return (
        <div className={`bg-[#1C1210] rounded-2xl p-6 border border-white/5 flex flex-col justify-center ${colSpan ? 'col-span-2' : ''}`}>
            <p className="text-[10px] font-mono text-white/50 tracking-widest mb-2 uppercase">{title}</p>
            <p className={`text-4xl font-bold ${highlight ? 'text-teal-400' : 'text-white'}`}>
                {value}
            </p>
        </div>
    );
}

export function ProfileMatchSummary({ stats }) {
    // stats: { totalMatches, wins, winRate, totalCardsPlayed, totalCardsDrawn, timesShoutedUno }
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white">Registro de Partidas</h2>
            <div className="grid grid-cols-2 gap-4">
                <SummaryBlock title="Nº de Partidas" value={stats?.totalMatches?.toLocaleString() || "0"} />
                <SummaryBlock title="Vitórias" value={stats?.wins?.toLocaleString() || "0"} highlight />
                <SummaryBlock title="Taxa de Vitória" value={`${stats?.winRate || "0"}%`} colSpan />
                <SummaryBlock title="UNO!!!" value={stats?.timesShoutedUno?.toLocaleString() || "0"} />
                <SummaryBlock title="Cartas Jogadas" value={stats?.totalCardsPlayed?.toLocaleString() || "0"} />
            </div>
        </div>
    );
}
