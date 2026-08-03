import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

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
