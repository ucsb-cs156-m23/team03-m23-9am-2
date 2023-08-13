import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";

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
            axiosMock.onGet("/api/recommendationRequest", { params: { id: 17 } }).timeout();
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
            expect(screen.queryByTestId("RecommendationRequest-name")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/recommendationRequest", { params: { id: 17 } }).reply(200, {
                id: 17,
                //name: "Freebirds",
                //description: "Burritos"
                requesterEmail:"Burritos@ucsb.edu",
                professorEmail:"Burritos@ucsbe.edu",
                explanation:"Burritos",
                dateRequested:"2023-08-12T18:30:00",
                dateNeeded:"2023-08-12T18:30:00",
                done:"1"
            });
            axiosMock.onPut('/api/recommendationRequest').reply(200, {
                id: "17",
                //name: "Freebirds World Burrito",
                //description: "Really big Burritos"

                requesterEmail:"1Burritos@ucsb.edu",
                professorEmail:"1Burritos@ucsbe.edu",
                explanation:"1Burritos",
                dateRequested:"2023-08-12T18:30:01",
                dateNeeded:"2023-08-12T18:30:01",
                done:"1"
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
//restaur
            await screen.findByTestId("RecommendationRequestForm-id");

            const idField = screen.getByTestId("RecommendationRequestForm-id");
            const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
            const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
            const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
            const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
            const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
            const doneField = screen.getByTestId("RecommendationRequestForm-done");


            const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(requesterEmailField).toBeInTheDocument();
            expect(requesterEmailField).toHaveValue("Burritos@ucsb.edu");
            expect(professorEmailField).toBeInTheDocument();
            expect(professorEmailField).toHaveValue("Burritos@ucsbe.edu");

            expect(explanationField).toBeInTheDocument();
            expect(explanationField).toHaveValue("Burritos");

            expect(dateRequestedField).toBeInTheDocument();
            expect(dateRequestedField).toHaveValue("2023-08-12T18:30:00");

            expect(dateNeededField).toBeInTheDocument();
            expect(dateNeededField).toHaveValue("2023-08-12T18:30:00");

            expect(doneField).toBeInTheDocument();
            expect(doneField).toHaveValue("1");

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(requesterEmailField, { target: { value: '1Burritos@ucsb.edu' } });
            fireEvent.change(professorEmailField, { target: { value: '1Burritos@ucsb.edu' } });
            fireEvent.change(explanationField, { target: { value: '1Burritos' } });
            fireEvent.change(dateRequestedField, { target: { value: '2023-08-12T18:30:01' } });
            fireEvent.change(dateNeededField, { target: { value: '2023-08-12T18:30:01' } });
            fireEvent.change(doneField, { target: { value: '1' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("RecommendationRequest Updated - id: 17 requesterEmail: 1Burritos@ucsb.edu professorEmail: 1Burritos@ucsb.edu explanation: 1Burritos dateRequested: 2023-08-12T18:30:01 dateNeeded: 2023-08-12T18:30:01 done: 1");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/recommendationRequest" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                //name: 'Freebirds World Burrito',
                //description: 'Totally Giant Burritos'
                requesterEmail:"1Burritos@ucsb.edu",
                professorEmail:"1Burritos@ucsbe.edu",
                explanation:"1Burritos",
                dateRequested:"2023-08-12T18:30:01",
                dateNeeded:"2023-08-12T18:30:01",
                done:"1"
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
/////////////////////////////////////////////////////////////////////////////////
            await screen.findByTestId("RecommendationRequestForm-id");

            const idField = screen.getByTestId("RecommendationRequestForm-id");
            const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
            const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
            const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
            const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
            const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
            const doneField = screen.getByTestId("RecommendationRequestForm-done");

            const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

            expect(idField).toHaveValue("17");
            expect(requesterEmailField).toHaveValue("Burritos@ucsb.edu");
            expect(professorEmailField).toHaveValue("Burritos@ucsb.edu");
            expect(explanationField).toHaveValue("Burritos");
            expect(dateRequestedField).toHaveValue("2023-08-12T18:30:00");
            expect(dateNeededField).toHaveValue("2023-08-12T18:30:00");
            expect(doneField).toHaveValue("1");


            expect(submitButton).toBeInTheDocument();

            fireEvent.change(requesterEmailField, { target: { value: '1Burritos@ucsb.edu' } })
            fireEvent.change(professorEmailField, { target: { value: '1Burritos@ucsb.edu' } })
            fireEvent.change(explanationField, { target: { value: '1Burritos' } })
            fireEvent.change(dateRequestedField, { target: { value: '2023-08-12T18:30:01' } })
            fireEvent.change(dateNeededField, { target: { value: '2023-08-12T18:30:01' } })
            fireEvent.change(doneField, { target: { value: '1' } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("RecommendationRequest Updated - id: 17 requesterEmail: 1Burritos@ucsb.edu professorEmail: 1Burritos@ucsb.edu explanation: 1Burritos dateRequested: 2023-08-12T18:30:01 dateNeeded: 2023-08-12T18:30:01 done: 1");
            expect(mockNavigate).toBeCalledWith({ "to": "/recommendationRequest" });
        });

       //restaur
    });
});
