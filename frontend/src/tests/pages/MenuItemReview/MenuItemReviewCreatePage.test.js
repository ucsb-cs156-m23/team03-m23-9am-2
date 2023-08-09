import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /menuitemreview", async () => {

        const queryClient = new QueryClient();
        const review = {
            "id": 2,
            "itemId": 914,
            "reviewerEmail": "toji@gmail.com",
            "stars": 4,
            "localDateTime": "2023-07-28T04:04:27.541",
            "comments": "unga bunga I like food"
        };

        axiosMock.onPost("/api/menuitemreview/post").reply(202, review);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("itemId")).toBeInTheDocument();
        });

        const itemIdInput = screen.getByLabelText("Item ID");
        const reviewerEmailInput = screen.getByLabelText("Reviewer Email");
        const starsInput = screen.getByLabelText("Stars");
        const commentsInput = screen.getByLabelText("Comments");

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(itemIdInput, { target: { value: '914' } })
        fireEvent.change(reviewerEmailInput, { target: { value: 'toji@gmail.com' } })
        fireEvent.change(starsInput, { target: { value: '4' } })
        fireEvent.change(commentsInput, { target: { value: 'unga bunga I like food' } })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            "itemId": "914",
            "reviewerEmail": "toji@gmail.com",
            "stars": "4",
            "comments": "unga bunga I like food"
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New review Created - id: 2 reviewerEmail: toji@gmail.com");
        expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });

    });
});
