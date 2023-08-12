import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBOrganizationForm from "main/components/UCSBOrganizations/UCSBOrganizationForm";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";

import { QueryClient, QueryClientProvider } from "react-query";
//import { ucsbDatesFixtures } from "fixtures/ucsbDatesFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UCSBOrganizationForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["OrgTranslationShort", "OrgTranslation","Inactive"];
    const testId = "UCSBOrganizationForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm initialContents={ucsbOrganizationFixtures.oneOrganization} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-orgCode`)).toBeInTheDocument();
        expect(screen.getByText(`OrgCode`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });


    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");
        fireEvent.click(submitButton);

        await screen.findByText(/short org translation is required/);
        expect(screen.getByText(/org Translation is required/)).toBeInTheDocument();

        const nameInput = screen.getByTestId(`${testId}-orgTranslationShort`);
        const orgTransInput = screen.getByTestId(`${testId}-orgTranslation`);
        const inactiveInput = screen.getByTestId(`${testId}-inactive`);
        expect(inactiveInput).toHaveValue("true");
        fireEvent.change(nameInput, { target: { value: "a".repeat(31) } });
        fireEvent.change(orgTransInput, { target: { value: "a".repeat(31) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
        });
        expect(screen.queryByText(/org Translation is required/)).not.toBeInTheDocument();
    });

    test("change inactive value", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        const inactiveField = screen.getByLabelText("Inactive");
        expect(inactiveField).toHaveValue("true");
    
        fireEvent.change(inactiveField, { target: { value: "false" } });
        
        fireEvent.click(submitButton);
        expect(inactiveField).toHaveValue("false");
    
        fireEvent.change(inactiveField, { target: { value: "true" } });
    
        fireEvent.click(submitButton);
        expect(inactiveField.value).toBe("true");
    
    
      });

});

