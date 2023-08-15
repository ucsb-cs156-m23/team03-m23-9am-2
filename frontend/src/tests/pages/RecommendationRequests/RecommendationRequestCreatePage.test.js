import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
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

describe("RecommendationRequestCreatePage tests", () => {

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
                    <RecommendationRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /recommendationRequest", async () => {

        const queryClient = new QueryClient();
        const recommendationRequest = {
            id: 3,
            //name: "South Coast Deli",
            //description: "Sandwiches and Salads"
            requesterEmail: "south@ucsb.edu",
            professorEmail: "south@ucsb.edu",
            explanation: "south",
            dateRequested: "2023-08-12T14:44:35",
            dateNeeded: "2023-08-12T14:44:35",
            done: "true"
        };

        axiosMock.onPost("/api/recommendationRequest/post").reply(202, recommendationRequest);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("RequesterEmail")).toBeInTheDocument();
        });

        const requesterEmailInput = screen.getByLabelText("RequesterEmail");
        expect(requesterEmailInput).toBeInTheDocument();

        const professorEmailInput = screen.getByLabelText("ProfessorEmail");
        expect(professorEmailInput).toBeInTheDocument();

        const explanationInput = screen.getByLabelText("Explanation");
        expect(explanationInput).toBeInTheDocument();
        const dateRequestedInput = screen.getByLabelText("DateRequested");
        expect(dateRequestedInput).toBeInTheDocument();
        const dateNeededInput = screen.getByLabelText("DateNeeded");
        expect(dateNeededInput).toBeInTheDocument();

        const doneInput = screen.getByLabelText("Done");
        expect(doneInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(requesterEmailInput, { target: { value: 'south@ucsb.edu' } })
        fireEvent.change(professorEmailInput, { target: { value: 'south@ucsb.edu' } })
        fireEvent.change(explanationInput, { target: { value: 'south' } })
        fireEvent.change(dateRequestedInput, { target: { value: '2023-08-12T14:44:35' } })
        fireEvent.change(dateNeededInput, { target: { value: '2023-08-12T14:44:35' } })
        fireEvent.change(doneInput, { target: { value: 'true' } })
        
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            //name: "South Coast Deli",
            //description: "Sandwiches and Salads"
            requesterEmail: "south@ucsb.edu",
            professorEmail: "south@ucsb.edu",
            explanation: "south",
            dateRequested: "2023-08-12T14:44:35",
            dateNeeded: "2023-08-12T14:44:35",
            done: "true"

        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New recommendationRequest Created - id: 3 requesterEmail: south@ucsb.edu professorEmail: south@ucsb.edu explanation: south dateRequested: 2023-08-12T14:44:35 dateNeeded: 2023-08-12T14:44:35 done: true");
        
            
            
        expect(mockNavigate).toBeCalledWith({ "to": "/recommendationRequest" });

    });
});


