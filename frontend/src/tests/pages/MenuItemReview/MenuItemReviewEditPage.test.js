import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/menuitemreview", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Review");
            expect(screen.queryByTestId("MenuItemReview-reviewerEmail")).not.toBeInTheDocument();
            restoreConsole();
        });
    });
/*
    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/menuitemreview", { params: { id: 17 } }).reply(200, {
                id: 41,
                itemId: 541,
                reviewerEmail: "cynthia@gmail.com",
                stars: 4,
                localDateTime:  "2023-12-12T11:11",
                comments: "ayyyyyyyyy lmao"
            });
            axiosMock.onPut('/api/menuitemreview').reply(200, {
                id: 42,
                itemId: 542,
                reviewerEmail: "cyndaquil@gmail.com",
                stars: 5,
                localDateTime:  "2021-11-12T11:11",
                comments: "fire blast missed!"
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        
            await screen.findByTestId("MenuItemReviewForm-id");
        
            const idField = screen.getByTestId("MenuItemReviewForm-id");
            const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
            const emailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            const dateTimeField = screen.getByTestId("MenuItemReviewForm-localDateTime");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");
        
            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue(review.id);
            expect(itemIdField).toBeInTheDocument();
            expect(itemIdField).toHaveValue(review.itemId);
            expect(emailField).toBeInTheDocument();
            expect(emailField).toHaveValue(review.reviewerEmail);
            expect(starsField).toBeInTheDocument();
            expect(starsField).toHaveValue(review.stars);
            expect(dateTimeField).toBeInTheDocument();
            expect(dateTimeField).toHaveValue(review.localDateTime);
            expect(commentsField).toBeInTheDocument();
            expect(commentsField).toHaveValue(review.comments);

            expect(submitButton).toHaveTextContent("Update");
        
            fireEvent.change(emailField, { target: { value: 'NewEmail@example.com' } });
            fireEvent.change(itemIdField, { target: { value: 'NewItemId' } });
            fireEvent.change(starsField, { target: { value: '5' } });
            fireEvent.change(dateTimeField, { target: { value: '2023-12-12T11:11' } });
            fireEvent.change(commentsField, { target: { value: "New Comment" } });
            fireEvent.click(submitButton);
        
            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("MenuItemReview Updated - id: " + review.id + " reviewerEmail: NewEmail@example.com");
            expect(mockNavigate).toBeCalledWith({ "to": "/menuItemReview" });
        
            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: review.id });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                itemId: "NewItemId",
                reviewerEmail: "NewEmail@example.com",
                stars: "5",
                localDateTime: "2023-12-12T11:11",
                comments: "New Comment"
            })); // posted object
        });
        

        const queryClient2 = new QueryClient();
        test("Changes when you click Update", async () => {
            
            render(
                <QueryClientProvider client={queryClient2}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByTestId("MenuItemReviewForm-id");
        
            const idField = screen.getByTestId("MenuItemReviewForm-id");
            const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
            const emailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            const dateTimeField = screen.getByTestId("MenuItemReviewForm-localDateTime");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");
        
            expect(idField).toHaveValue(review.id);
            expect(itemIdField).toHaveValue(review.itemId);
            expect(emailField).toHaveValue(review.reviewerEmail);
            expect(starsField).toHaveValue(review.stars);
            expect(dateTimeField).toHaveValue(review.localDateTime);
            expect(commentsField).toHaveValue(review.comments);
            expect(submitButton).toBeInTheDocument();
        
            fireEvent.change(emailField, { target: { value: 'AnotherEmail@example.com' } });
            fireEvent.change(itemIdField, { target: { value: 'AnotherItemId' } });
            fireEvent.change(starsField, { target: { value: '4' } });
            fireEvent.change(dateTimeField, { target: { value: '2024-01-01T10:10' } });
            fireEvent.change(commentsField, { target: { value: "Another Comment" } });
            fireEvent.click(submitButton);
        
            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("MenuItemReview Updated - id: " + review.id + " reviewerEmail: AnotherEmail@example.com");
            expect(mockNavigate).toBeCalledWith({ "to": "/menuItemReview" });
        });
        

       
    });*/
});