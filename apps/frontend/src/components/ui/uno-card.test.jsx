import { fireEvent, render, screen } from "@testing-library/react";
import { UnoCard } from "./uno-card";

jest.mock("next/image", () => {
  return function MockImage({ src, alt, onError, ...props }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} onError={onError} {...props} />;
  };
});

jest.mock("@/helpers/get-card-image", () => ({
  getCardImage: jest.fn(({ color, value }) => `/cards/${color}_${value}.png`),
}));

describe("Componente UnoCard", () => {
  it("deve renderizar a carta normal com a imagem correta", () => {
    render(<UnoCard color="red" type="number" value={7} />);

    const img = screen.getByRole("img", { name: "red number 7" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/cards/red_7.png");
  });

  it("deve renderizar o verso da carta quando isBack for true", () => {
    render(<UnoCard isBack color="red" value={5} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/cards/back.png");
  });

  it("deve assumir o 'value' como 'actualType' quando 'type' não for fornecido", () => {
    render(<UnoCard color="blue" value="skip" />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/cards/blue_skip.png");
  });

  it("deve acionar o fallback e alterar cores quando a imagem falhar ao carregar", () => {
    const { container } = render(<UnoCard color="green" value={3} />);

    const cardContainer = container.firstChild;
    const img = screen.getByRole("img");

    fireEvent.error(img);

    expect(img).toHaveStyle("display: none");
    expect(cardContainer).toHaveClass("bg-green-500");
    expect(cardContainer).not.toHaveClass("bg-gray-900");
  });

  it("deve aplicar a cor padronizada bg-gray-200 no fallback quando a cor fornecida for inválida", () => {
    const { container } = render(<UnoCard color="invalid-color" value={1} />);

    const cardContainer = container.firstChild;
    const img = screen.getByRole("img");

    fireEvent.error(img);

    expect(cardContainer).toHaveClass("bg-gray-200");
  });

  it("deve repassar classes personalizadas via prop className", () => {
    const { container } = render(
      <UnoCard color="yellow" value={9} className="custom-card-class" />
    );

    expect(container.firstChild).toHaveClass("custom-card-class");
  });
});