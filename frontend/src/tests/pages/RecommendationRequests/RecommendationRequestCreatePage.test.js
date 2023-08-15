import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequests/RecommendationRequestCreatePage";
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

    test("on submit, makes request to backend, and redirects to /RecommendationRequest", async () => {

        const queryClient = new QueryClient();
        const RecommendationRequest = {
            id: 3,
            requesterEmail: "3a@ucsb.edu",
            professorEmail: "3b@ucsb.edu" ,
            explanation: "3",
            dateRequested: "2022-09-28T00:00:00",
            dateNeeded: "2022-09-28T00:00:00" , 
            done: "true"
        };

        axiosMock.onPost("/api/RecommendationRequest/post").reply(202, RecommendationRequest);

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

        const requesterInput = screen.getByLabelText("RequesterEmail");
        expect(requesterInput).toBeInTheDocument();

        const profInput = screen.getByLabelText("ProfessorEmail");
        expect(profInput).toBeInTheDocument();

        const explanationInput = screen.getByLabelText("Explanation");
        expect(explanationInput).toBeInTheDocument();

        const dateNeededInput = screen.getByLabelText("DateNeeded");
        expect(dateNeededInput).toBeInTheDocument();

        const dateRequestedInput = screen.getByLabelText("DateRequested");
        expect(dateRequestedInput).toBeInTheDocument();

        const doneInput = screen.getByLabelText("Done");
        expect(doneInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(requesterInput, { target: { value: '3a@ucsb.edu' } })
        fireEvent.change(profInput, { target: { value: '3b@ucsb.edu' } })
        fireEvent.change(explanationInput, { target: { value: '3' } })
        fireEvent.change(dateNeededInput, { target: { value: '2022-09-28T00:00:00' } })
        fireEvent.change(dateRequestedInput, { target: { value: '2022-09-28T00:00:00' } })
        fireEvent.change(doneInput, { target: { value: 'true' } })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            requesterEmail: "3a@ucsb.edu",
            professorEmail: "3b@ucsb.edu" ,
            explanation: "3",
            dateRequested: "2022-09-28T00:00:00",
            dateNeeded: "2022-09-28T00:00:00" , 
            done: "true"
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New RecommendationRequest Created - id: 3 requester: 3a@ucsb.edu");
        expect(mockNavigate).toBeCalledWith({ "to": "/RecommendationRequest" });

    });
});


