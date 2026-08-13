"use client";

import { WaitingRoomView } from "@/view/room/waiting-room.view";
import { useParams } from "next/navigation";

export default function WaitingRoomPage() {
    const { code } = useParams();

    return <WaitingRoomView roomCode={code} />;
}
