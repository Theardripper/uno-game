import { GameLayout } from "@/widgets/layout/game-layout";

export default function Layout({ children }) {
    return (
        <GameLayout>
            {children}
        </GameLayout>
    );
}
