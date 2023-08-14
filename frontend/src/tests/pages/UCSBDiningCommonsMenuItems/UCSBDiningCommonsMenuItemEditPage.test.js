import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemEditPage";

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

describe("UCSBDiningCommonsMenuItemEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsbdiningcommonsmenuitem", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit UCSBDiningCommonsMenuItem");
            expect(screen.queryByTestId("UCSBDiningCommonsMenuItem-name")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/ucsbdiningcommonsmenuitem", { params: { id: 17 } }).reply(200, {
                id: 17,
                diningCommonsCode: "DC17",
                name: "Item17",
                station: "Station17"
            });
            axiosMock.onPut('/api/ucsbdiningcommonsmenuitem').reply(200, {
                id: "17",
                diningCommonsCode: "DC17PLUS",
                name: "Item17ULTRA",
                station: "Station17MEGA"
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBDiningCommonsMenuItemForm-id");

            const idField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-id");
            const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
            const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-station");
            const DCField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
            const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(nameField).toBeInTheDocument();
            expect(nameField).toHaveValue("Item17");
            expect(stationField).toBeInTheDocument();
            expect(stationField).toHaveValue("Station17");
            expect(DCField).toBeInTheDocument();
            expect(DCField).toHaveValue("DC17");

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(nameField, { target: { value: 'Item17ULTRA' } });
            fireEvent.change(stationField, { target: { value: 'Station17MEGA' } });
            fireEvent.change(DCField, { target: { value: 'DC17PLUS' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBDiningCommonsMenuItem Updated - id: 17 name: Item17ULTRA");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/UCSBDiningCommonsMenuItem" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                diningCommonsCode: "DC17PLUS",
                name: "Item17ULTRA",
                station: "Station17MEGA"
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBDiningCommonsMenuItemForm-id");

            const idField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-id");
            const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
            const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-station");
            const DCField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
            const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Item17");
            expect(stationField).toHaveValue("Station17");
            expect(DCField).toHaveValue("DC17");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: 'Item17MEGA' } });
            fireEvent.change(stationField, { target: { value: 'Station17ULTRA' } });
            fireEvent.change(DCField, { target: { value: 'DC17PLUS' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBDiningCommonsMenuItem Updated - id: 17 name: Item17ULTRA");
            expect(mockNavigate).toBeCalledWith({ "to": "/UCSBDiningCommonsMenuItem" });
        });

       
    });
});
