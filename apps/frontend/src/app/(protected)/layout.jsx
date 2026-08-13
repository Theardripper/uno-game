import { Header } from "@/components/layout/header";

export default function Layout({ children }) {
    return (
        <>
            <Header />
            {children}
        </>
    );
}
