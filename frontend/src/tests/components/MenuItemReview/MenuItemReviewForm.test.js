import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import {menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("MenuItemReviewForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Item Id", "Reviewer Email", "Stars", "Local Date Time", "Comments"];
    const testId = "MenuItemReviewForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <MenuItemReviewForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <MenuItemReviewForm initialContents={menuItemReviewFixtures.oneMenuItemReview} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-itemId`)).toBeInTheDocument();
        expect(screen.getByText(`Item Id`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-reviewerEmail`)).toBeInTheDocument();
        expect(screen.getByText(`Reviewer Email`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-stars`)).toBeInTheDocument();
        expect(screen.getByText(`Stars`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-localDateTime`)).toBeInTheDocument();
        expect(screen.getByText(`Local Date Time`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-comments`)).toBeInTheDocument();
        expect(screen.getByText(`Comments`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <MenuItemReviewForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    
    test("error messages appear on bad input", async () => {
        render(
            <Router >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId(`${testId}-reviewerEmail`);
            const requestTimeField = screen.getByTestId(`${testId}-localDateTime`);
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");
        fireEvent.change(requestTimeField, {target: {value: 'bad-input'}});
        fireEvent.click(submitButton);
        //await screen.findByText(/Please enter a valid value. The field is incomplete or has an invalid date./);
        await screen.findByText(/Local Date Time is required./);
    });

    test("error messages appear on bad input", async () => {
        render(
            <Router >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId(`${testId}-reviewerEmail`);
            const requestTimeField = screen.getByTestId(`${testId}-stars`);
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");
        fireEvent.change(requestTimeField, {target: {value: '0'}});
        fireEvent.click(submitButton);
        //await screen.findByText(/Please enter a valid value. The field is incomplete or has an invalid date./);
        await screen.findByText(/Minimum value is 1/);
    });

    test("error messages appear on bad input", async () => {
        render(
            <Router >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId(`${testId}-reviewerEmail`);
            const requestTimeField = screen.getByTestId(`${testId}-stars`);
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");
        fireEvent.change(requestTimeField, {target: {value: '6'}});
        fireEvent.click(submitButton);
        await screen.findByText(/Maximum value is 5/);
    });
    

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <MenuItemReviewForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Item Id is required/);
        expect(screen.getByText(/Reviewer Email is required/)).toBeInTheDocument();
        expect(screen.getByText(/Stars are required/)).toBeInTheDocument();
        expect(screen.getByText(/Local Date Time is required/)).toBeInTheDocument();

        const itemIdInput = screen.getByTestId(`${testId}-itemId`);
        fireEvent.change(itemIdInput, { target: { value: "a".repeat(31) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
        });
    });

});
