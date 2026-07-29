import React from "react";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8 mt-auto bg-background">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground font-medium">
          &copy; {new Date().getFullYear()} UNO Game. Todos os direitos
          reservados.
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">
            Sobre
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Regras
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Contato
          </a>
        </nav>
      </div>
    </footer>
  );
}
