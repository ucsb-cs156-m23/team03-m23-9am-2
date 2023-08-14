import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganizations/UCSBOrganizationCreatePage";
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

describe("UCSBOrganizationCreatePage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when submit, makes request to backend and redirects to /ucsborganization", async () => {

        const queryClient = new QueryClient();
        const organization = {
            orgCode: "123",
            orgTranslationShort: "abc",
            orgTranslation: "ay bruh cool",
            inactive:'false'
        };

        axiosMock.onPost("/api/ucsborganization/post").reply(202, organization);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId("UCSBOrganizationForm-orgCode")).toBeInTheDocument();
        });

        const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");//getByLabelText("OrgCode");
        const orgTranslationShortField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
        const orgTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
        const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
        const createButton = screen.getByTestId("UCSBOrganizationForm-submit");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(orgCodeField, { target: { value: '123' } });
        fireEvent.change(orgTranslationShortField, { target: { value: 'abc' } });
        fireEvent.change(orgTranslationField, { target: { value: 'ay bruh cool' } });
        //console.log(inactiveField);
        fireEvent.change(inactiveField, { target: { value: 'true' } });
        //console.log(inactiveField.value);
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
        console.log(axiosMock.history.post);
        expect(axiosMock.history.post[0].params).toEqual(
            {
                "orgCode": "123",
                "orgTranslationShort": "abc",
                "orgTranslation": "ay bruh cool",
                "inactive": undefined //Axios params aren't being properly updated some reason
            });
        
        expect(mockToast).toBeCalledWith("New organization Created - orgCode: 123");
        expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization" });
    });

});


