"use client";

import { GameView } from "@/view/game/game.view";
import { useParams } from "next/navigation";

export default function GamePage() {
    const { code } = useParams();

    return <GameView code={code} />;
}
