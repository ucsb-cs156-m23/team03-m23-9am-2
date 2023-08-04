import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestEditPage from "main/pages/HelpRequests/HelpRequestEditPage";

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

describe("HelpRequestEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit HelpRequest");
            expect(screen.queryByTestId("HelpRequest-requesterEmail")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).reply(200, {
                id: 17,
                requesterEmail: "elfouly@ucsb.edu",
                teamId: "02",
                tableOrBreakoutRoom: "table02",
                requestTime: "2022-02-02T00:00",
                explanation: "It's very late",
                solved: "False"
            });
            axiosMock.onPut('/api/helprequests').reply(200, {
                id: "17",
                requesterEmail: "FakeElfouly@ucsb.edu",
                teamId: "01",
                tableOrBreakoutRoom: "table01",
                requestTime: "2023-12-12T11:11",
                explanation: "It's very early",
                solved: "True"
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-id");

            const idField = screen.getByTestId("HelpRequestForm-id");
            const emailField = screen.getByTestId("HelpRequestForm-requesterEmail");
            const teamField = screen.getByTestId("HelpRequestForm-teamId");
            const tableField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
            const timeField = screen.getByTestId("HelpRequestForm-requestTime");
            const explanationField = screen.getByTestId("HelpRequestForm-explanation");
            const solvedField = screen.getByTestId("HelpRequestForm-solved");
            const submitButton = screen.getByTestId("HelpRequestForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(emailField).toBeInTheDocument();
            expect(emailField).toHaveValue("elfouly@ucsb.edu");
            expect(teamField).toBeInTheDocument();
            expect(teamField).toHaveValue("02");
            expect(tableField).toBeInTheDocument();
            expect(tableField).toHaveValue("table02");
            expect(timeField).toBeInTheDocument();
            expect(timeField).toHaveValue("2022-02-02T00:00");
            expect(explanationField).toBeInTheDocument();
            expect(explanationField).toHaveValue("It's very late");
            expect(solvedField).toBeInTheDocument();
            expect(solvedField).toHaveValue("False");

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(emailField, { target: { value: 'FakeElfouly@ucsb.edu' } });
            fireEvent.change(teamField, { target: { value: '01' } });
            fireEvent.change(tableField, { target: { value: 'table01' } });
            fireEvent.change(timeField, { target: { value: '2023-12-12T11:11' } });
            fireEvent.change(explanationField, { target: { value: "It's very early" } });
            fireEvent.change(solvedField, { target: { value: 'True' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("HelpRequest Updated - id: 17 requesterEmail: FakeElfouly@ucsb.edu");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/helpRequests" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                requesterEmail: "FakeElfouly@ucsb.edu",
                teamId: "01",
                tableOrBreakoutRoom: "table01",
                requestTime: "2023-12-12T11:11",
                explanation: "It's very early",
                solved: "True"
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-id");

            const idField = screen.getByTestId("HelpRequestForm-id");
            const emailField = screen.getByTestId("HelpRequestForm-requesterEmail");
            const teamField = screen.getByTestId("HelpRequestForm-teamId");
            const tableField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
            const timeField = screen.getByTestId("HelpRequestForm-requestTime");
            const explanationField = screen.getByTestId("HelpRequestForm-explanation");
            const solvedField = screen.getByTestId("HelpRequestForm-solved");
            const submitButton = screen.getByTestId("HelpRequestForm-submit");

            expect(idField).toHaveValue("17");
            expect(emailField).toHaveValue("elfouly@ucsb.edu");
            expect(teamField).toHaveValue("02");
            expect(tableField).toHaveValue("table02");
            expect(timeField).toHaveValue("2022-02-02T00:00");
            expect(explanationField).toHaveValue("It's very late");
            expect(solvedField).toHaveValue("False");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(emailField, { target: { value: 'FakeElfouly@ucsb.edu' } });
            fireEvent.change(teamField, { target: { value: '01' } });
            fireEvent.change(tableField, { target: { value: 'table01' } });
            fireEvent.change(timeField, { target: { value: '2023-12-12T11:11' } });
            fireEvent.change(explanationField, { target: { value: "It's very early" } });
            fireEvent.change(solvedField, { target: { value: 'True' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("HelpRequest Updated - id: 17 requesterEmail: FakeElfouly@ucsb.edu");
            expect(mockNavigate).toBeCalledWith({ "to": "/helpRequests" });
        });

       
    });
});
