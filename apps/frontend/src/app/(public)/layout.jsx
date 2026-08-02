import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";

/**
 * Layout padrão para páginas públicas (não autenticadas).
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {React.JSX.Element}
 */
export default function Layout({ children }) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}
