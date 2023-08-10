import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewIndexPage from "main/pages/MenuItemReview/MenuItemReviewIndexPage"; // Updated to MenuItemReview

import mockConsole from "jest-mock-console";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures"; // Assuming you have a fixtures file for MenuItemReview

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

describe("MenuItemReviewIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);
    const testId = "MenuItemReviewTable"; // Updated table test id

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const queryClient = new QueryClient();

    test("Renders with Create Button for admin user", async () => {
        setupAdminUser();
        axiosMock.onGet("/api/menuitemreview/all").reply(200, []); // Assume your endpoint structure

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Create Review/)).toBeInTheDocument();
        });

        const button = screen.getByText(/Create Review/); // Adjusted text to "Review"
        expect(button).toHaveAttribute("href", "/menuitemreview/create");
        expect(button).toHaveAttribute("style", "float: right;");
    });

    // Additional tests will follow the same pattern. For example:

    test("renders three reviews correctly for regular user", async () => {
        setupUserOnly();
        axiosMock.onGet("/api/menuitemreview/all").reply(200, menuItemReviewFixtures.threeReviews); // Assuming you have a fixtures file for MenuItemReview with threeReviews

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // Continue with assertions that test the rendering of the three reviews...
    });

    // Continue to refactor the other tests as well to fit the MenuItemReview context...
});
