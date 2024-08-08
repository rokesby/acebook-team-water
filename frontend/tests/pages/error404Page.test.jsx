import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Error404Page } from "../../src/pages/Error/Error404Page";

describe("Error404Page", () => {
    it("should display the 404 page for an unknown route", () => {
        // creating a memory router with a wrong URL
        const router = createMemoryRouter(
            [
                {
                    path: "*",
                    element: <Error404Page />,
                },
            ],
            {
                initialEntries: ["/unknown-route"],
            }
        );

        render(<RouterProvider router={router} />);

        expect(screen.getByText(/404 - Page Not Found/i)).toBeDefined();
        expect(
            screen.getByText(
                /The page you are looking for does not exist or has been moved./i
            )
        ).toBeDefined();
        expect(
            screen.getByRole("link", { name: /Go to Home/i })
        ).toBeDefined();
    });
});
