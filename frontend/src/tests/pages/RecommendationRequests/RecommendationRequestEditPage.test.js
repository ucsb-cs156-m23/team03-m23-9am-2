import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationRequestEditPage from "main/pages/RecommendationRequests/RecommendationRequestEditPage";

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

describe("RecommendationRequestEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/RecommendationRequest", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit RecommendationRequest");
            expect(screen.queryByTestId("RecommendationRequest-requesterEmail")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/RecommendationRequest", { params: { id: 17 } }).reply(200, {
                id: 17,
                requesterEmail: "17a@ucsb.edu",
                professorEmail: "17b@ucsb.edu" ,
                explanation: "17",
                dateRequested: "2022-09-28T00:00:00",
                dateNeeded: "2022-09-28T00:00:00" , 
                done: "true"
            });
            axiosMock.onPut('/api/RecommendationRequest').reply(200, {
                id: "17",
                requesterEmail: "3a@ucsb.edu",
                professorEmail: "3b@ucsb.edu" ,
                explanation: "3",
                dateRequested: "2023-09-28T00:00:00",
                dateNeeded: "2023-09-28T00:00:00" , 
                done: "false"
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("RecommendationRequestForm-id");

            const idField = screen.getByTestId("RecommendationRequestForm-id");
            const requesterField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
            const professorField = screen.getByTestId("RecommendationRequestForm-professorEmail");
            const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
            const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
            const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
            const doneField = screen.getByTestId("RecommendationRequestForm-done");
            const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(requesterField).toBeInTheDocument();
            expect(requesterField).toHaveValue("17a@ucsb.edu");
            expect(professorField).toBeInTheDocument();
            expect(professorField).toHaveValue("17b@ucsb.edu");
            expect(explanationField).toBeInTheDocument();
            expect(explanationField).toHaveValue("17");
            expect(dateNeededField).toBeInTheDocument();
            expect(dateNeededField).toHaveValue("2022-09-28T00:00:00");
            expect(dateRequestedField).toBeInTheDocument();
            expect(dateRequestedField).toHaveValue("2022-09-28T00:00:00");
            expect(doneField).toBeInTheDocument();
            expect(doneField).toHaveValue("true");


            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(requesterField, { target: { value: '3a@ucsb.edu' } });
            fireEvent.change(professorField, { target: { value: '3b@ucsb.edu' } });
            fireEvent.change(explanationField, { target: { value: '3' } });
            fireEvent.change(dateNeededField, { target: { value: '2023-09-28T00:00:00' } });
            fireEvent.change(dateRequestedField, { target: { value: '2023-09-28T00:00:00' } });
            fireEvent.change(doneField, { target: { value: 'false' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("RecommendationRequest Updated - id: 17 Requester: 3a@ucsb.edu");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/RecommendationRequest" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                requesterEmail: "3a@ucsb.edu",
                professorEmail: "3b@ucsb.edu" ,
                explanation: "3",
                dateRequested: "2023-09-28T00:00:00",
                dateNeeded: "2023-09-28T00:00:00" , 
                done: "false"
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("RecommendationRequestForm-id");

            const idField = screen.getByTestId("RecommendationRequestForm-id");
            const requesterField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
            const professorField = screen.getByTestId("RecommendationRequestForm-professorEmail");
            const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
            const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
            const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
            const doneField = screen.getByTestId("RecommendationRequestForm-done");
            const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

            expect(idField).toHaveValue("17");
            expect(requesterField).toHaveValue("17a@ucsb.edu");
            expect(professorField).toHaveValue("17b@ucsb.edu");
            expect(explanationField).toHaveValue("17");
            expect(dateNeededField).toHaveValue("2022-09-28T00:00:00");
            expect(dateRequestedField).toHaveValue("2022-09-28T00:00:00");
            expect(doneField).toHaveValue("true");

            fireEvent.change(requesterField, { target: { value: '3a@ucsb.edu' } });
            fireEvent.change(professorField, { target: { value: '3b@ucsb.edu' } });
            fireEvent.change(explanationField, { target: { value: '3' } });
            fireEvent.change(dateNeededField, { target: { value: '2023-09-28T00:00:00' } });
            fireEvent.change(dateRequestedField, { target: { value: '2023-09-28T00:00:00' } });
            fireEvent.change(doneField, { target: { value: 'false' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("RecommendationRequest Updated - id: 17 Requester: 3a@ucsb.edu");
            expect(mockNavigate).toBeCalledWith({ "to": "/RecommendationRequest" });
        });

       
    });
});
