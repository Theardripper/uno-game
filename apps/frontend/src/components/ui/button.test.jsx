import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";

import { Button, buttonVariants } from "./button";

describe("Componente Button", () => {
  it("deve renderizar o botão com o conteúdo correto", () => {
    render(<Button>Clique aqui</Button>);
    
    const button = screen.getByRole("button", { name: /clique aqui/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-slot", "button");
  });

  it("deve aplicar as classes da variante e tamanho padrão", () => {
    render(<Button>Padrão</Button>);
    
    const button = screen.getByRole("button");
    // Variante default
    expect(button).toHaveClass("bg-primary", "text-primary-foreground");
    // Tamanho default
    expect(button).toHaveClass("h-8");
  });

  it("deve aplicar as classes corretas quando variantes personalizadas são passadas", () => {
    render(
      <Button variant="destructive" size="lg">
        Deletar
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-destructive/10", "text-destructive", "h-9");
  });

  it("deve aplicar a classe 'w-full' quando a prop fullWidth for true", () => {
    render(<Button fullWidth>Botão Largo</Button>);
    
    const button = screen.getByRole("button");
    expect(button).toHaveClass("w-full");
  });

  it("não deve aplicar a classe 'w-full' por padrão quando fullWidth for false ou omitido", () => {
    render(<Button>Botão Normal</Button>);
    
    const button = screen.getByRole("button");
    expect(button).not.toHaveClass("w-full");
  });

  it("deve mesclar classes personalizadas via prop className", () => {
    render(<Button className="my-custom-class shadow-lg">Com Classe Extra</Button>);
    
    const button = screen.getByRole("button");
    expect(button).toHaveClass("my-custom-class", "shadow-lg");
  });

  it("deve disparar a função onClick quando clicado", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Clique</Button>);
    
    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("deve respeitar a propriedade disabled", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <Button disabled onClick={handleClick}>
        Desabilitado
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:pointer-events-none", "disabled:opacity-50");

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("deve repassar a ref para o elemento do DOM", () => {
    const ref = createRef();
    render(<Button ref={ref}>Com Ref</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

describe("Helper buttonVariants", () => {
  it("deve retornar as classes padrão quando executado sem parâmetros", () => {
    const classes = buttonVariants();
    expect(classes).toContain("bg-primary");
    expect(classes).toContain("h-8");
  });

  it("deve retornar as classes esperadas para uma combinação específica de variante e tamanho", () => {
    const classes = buttonVariants({ variant: "glass", size: "xl" });
    expect(classes).toContain("backdrop-blur-md");
    expect(classes).toContain("h-14");
  });
});