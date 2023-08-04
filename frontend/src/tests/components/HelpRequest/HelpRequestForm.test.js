import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import { helpRequestsFixtures } from "fixtures/helpRequestFixtures";

import { QueryClient, QueryClientProvider } from "react-query";
import HelpRequestForm from "main/components/HelpRequests/HelpRequestForm";
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("HelpRequestForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["requesterEmail", "teamId", "tableOrBreakoutRoom", "requestTime", "explanation", "solved"];
    const testId = "HelpRequestForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <HelpRequestForm />
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
                    <HelpRequestForm initialContents={helpRequestsFixtures.oneRequest} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <HelpRequestForm />
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
                    <HelpRequestForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/requesterEmail is required./);
        expect(screen.getByText(/teamId is required./)).toBeInTheDocument();
        expect(screen.getByText(/tableOrBreakoutRoom is required./)).toBeInTheDocument();
        expect(screen.getByText(/requestTime is required./)).toBeInTheDocument();
        expect(screen.getByText(/explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/solved is required./)).toBeInTheDocument();

        const emailInput = screen.getByTestId(`${testId}-requesterEmail`);
        const teamIdInput = screen.getByTestId(`${testId}-teamId`);
        const tableOrBreakoutRoomInput = screen.getByTestId(`${testId}-tableOrBreakoutRoom`);
        const requestTimeField = screen.getByTestId(`${testId}-requestTime`);
        const explanationInput = screen.getByTestId(`${testId}-explanation`);

        fireEvent.change(emailInput, { target: { value: "a".repeat(30) } });
        fireEvent.change(teamIdInput, { target: { value: "b".repeat(30) } });
        fireEvent.change(tableOrBreakoutRoomInput, { target: { value: "c".repeat(30) } });
        fireEvent.change(requestTimeField, { target: { value: "2022-01-02T12:00" } });
        fireEvent.change(explanationInput, { target: { value: "d".repeat(30) } });
        fireEvent.click(submitButton);

          await waitFor(() => {
            expect(screen.queryByText(/Max length 30 characters/)).not.toBeInTheDocument();
          });
            expect(screen.getByText(/solved is required./)).toBeInTheDocument();
            expect(screen.queryByText(/requestTime must be in ISO format/)).not.toBeInTheDocument();
            expect(screen.queryByText(/requesterEmail is required./)).not.toBeInTheDocument();
            expect(screen.queryByText(/teamId is required./)).not.toBeInTheDocument();
            expect(screen.queryByText(/tableOrBreakoutRoom is required./)).not.toBeInTheDocument();
            expect(screen.queryByText(/requestTime is required./)).not.toBeInTheDocument();
            expect(screen.queryByText(/explanation is required./)).not.toBeInTheDocument();

          fireEvent.change(emailInput, { target: { value: "a".repeat(31) } });
          fireEvent.change(teamIdInput, { target: { value: "" } });
          fireEvent.change(tableOrBreakoutRoomInput, { target: { value: "" } });
          fireEvent.change(requestTimeField, { target: { value: "" } });
          fireEvent.change(explanationInput, { target: { value: "" } });
          fireEvent.click(submitButton);
        

          await waitFor(() => {
            expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
          });
            expect(screen.getByText(/solved is required./)).toBeInTheDocument();
            expect(screen.queryByText(/requestTime must be in ISO format/)).not.toBeInTheDocument();
            expect(screen.queryByText(/requesterEmail is required./)).not.toBeInTheDocument();
            expect(screen.getByText(/teamId is required./)).toBeInTheDocument();
            expect(screen.getByText(/tableOrBreakoutRoom is required./)).toBeInTheDocument();
            expect(screen.getByText(/requestTime is required./)).toBeInTheDocument();
            expect(screen.getByText(/explanation is required./)).toBeInTheDocument();

          fireEvent.change(emailInput, { target: { value: "" } });
          fireEvent.change(teamIdInput, { target: { value: "a".repeat(31) } });
          fireEvent.click(submitButton);
        
          await waitFor(() => {
            expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
          });
            expect(screen.getByText(/solved is required./)).toBeInTheDocument();
            expect(screen.queryByText(/requestTime must be in ISO format/)).not.toBeInTheDocument();
            expect(screen.getByText(/requesterEmail is required./)).toBeInTheDocument();
            expect(screen.queryByText(/teamId is required./)).not.toBeInTheDocument();
            expect(screen.getByText(/tableOrBreakoutRoom is required./)).toBeInTheDocument();
            expect(screen.getByText(/requestTime is required./)).toBeInTheDocument();
            expect(screen.getByText(/explanation is required./)).toBeInTheDocument();

          fireEvent.change(emailInput, { target: { value: "" } });
          fireEvent.change(teamIdInput, { target: { value: "" } });
          fireEvent.change(tableOrBreakoutRoomInput, { target: { value: "a".repeat(31) } });
          fireEvent.change(requestTimeField, { target: { value: "" } });
          fireEvent.change(explanationInput, { target: { value: "" } });
          fireEvent.click(submitButton);
        

          await waitFor(() => {
            expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
          });
            expect(screen.getByText(/solved is required./)).toBeInTheDocument();
            expect(screen.queryByText(/requestTime must be in ISO format/)).not.toBeInTheDocument();
            expect(screen.getByText(/requesterEmail is required./)).toBeInTheDocument();
            expect(screen.getByText(/teamId is required./)).toBeInTheDocument();
            expect(screen.queryByText(/tableOrBreakoutRoom is required./)).not.toBeInTheDocument();
            expect(screen.getByText(/requestTime is required./)).toBeInTheDocument();
            expect(screen.getByText(/explanation is required./)).toBeInTheDocument();

          fireEvent.change(emailInput, { target: { value: "" } });
          fireEvent.change(teamIdInput, { target: { value: "" } });
          fireEvent.change(tableOrBreakoutRoomInput, { target: { value: "" } });
          fireEvent.change(requestTimeField, { target: { value: "" } });
          fireEvent.change(explanationInput, { target: { value: "a".repeat(31) } });
          fireEvent.click(submitButton);
    

          await waitFor(() => {
            expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
          });
            expect(screen.getByText(/solved is required./)).toBeInTheDocument();
            expect(screen.queryByText(/requestTime must be in ISO format/)).not.toBeInTheDocument();
            expect(screen.getByText(/requesterEmail is required./)).toBeInTheDocument();
            expect(screen.getByText(/teamId is required./)).toBeInTheDocument();
            expect(screen.getByText(/tableOrBreakoutRoom is required./)).toBeInTheDocument();
            expect(screen.getByText(/requestTime is required./)).toBeInTheDocument();
            expect(screen.queryByText(/explanation is required./)).not.toBeInTheDocument();

          fireEvent.change(emailInput, { target: { value: "" } });
          fireEvent.change(teamIdInput, { target: { value: "" } });
          fireEvent.change(tableOrBreakoutRoomInput, { target: { value: "" } });
          fireEvent.change(requestTimeField, { target: { value: "2022-01-02" } });
          fireEvent.change(explanationInput, { target: { value: "" } });
          fireEvent.click(submitButton);
        

          await waitFor(() => {
            expect(screen.queryByText(/Max length 30 characters/)).not.toBeInTheDocument();
          });
            expect(screen.getByText(/solved is required./)).toBeInTheDocument();
            expect(screen.getByText(/requestTime must be in ISO format/)).toBeInTheDocument();
            expect(screen.getByText(/requesterEmail is required./)).toBeInTheDocument();
            expect(screen.getByText(/teamId is required./)).toBeInTheDocument();
            expect(screen.getByText(/tableOrBreakoutRoom is required./)).toBeInTheDocument();
            expect(screen.queryByText(/requestTime is required./)).not.toBeInTheDocument();
            expect(screen.getByText(/explanation is required./)).toBeInTheDocument();
          

            fireEvent.change(requestTimeField, { target: { value: "2022-01-02T10" } });
            fireEvent.click(submitButton);
          
  
          await waitFor(() => {
            expect(screen.getByText(/requestTime must be in ISO format/)).toBeInTheDocument();
            });
            expect(screen.queryByText(/requestTime is required./)).not.toBeInTheDocument();

            fireEvent.change(requestTimeField, { target: { value: "2022-01-02T10:10" } });
            fireEvent.click(submitButton);
            
    
          await waitFor(() => {
            expect(screen.queryByText(/requestTime must be in ISO format/)).not.toBeInTheDocument();
            });
            expect(screen.queryByText(/requestTime is required./)).not.toBeInTheDocument();

            fireEvent.change(requestTimeField, { target: { value: "2022-01-02T10:10:10" } });
            fireEvent.click(submitButton);
            
    
          await waitFor(() => {
            expect(screen.queryByText(/requestTime must be in ISO format/)).not.toBeInTheDocument();
            });
            expect(screen.queryByText(/requestTime is required./)).not.toBeInTheDocument();

            fireEvent.change(requestTimeField, { target: { value: "2022-01T10:10" } });
            fireEvent.click(submitButton);
            
    
          await waitFor(() => {
            expect(screen.queryByText(/requestTime must be in ISO format/)).not.toBeInTheDocument();
            });
            expect(screen.queryByText(/requestTime is required./)).not.toBeInTheDocument();
          



    });

    test("change dropdown value", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <HelpRequestForm />
                </Router>
            </QueryClientProvider>
        );
      
        const dropdown = screen.getByText("Select an option"); // Use the appropriate label text or testId
        fireEvent.change(dropdown, { target: { value: "True" } });
      
        expect(dropdown.value).toBe("True");
        expect(screen.queryByText(/solved is required./)).not.toBeInTheDocument();

        fireEvent.change(dropdown, { target: { value: "False" } });
      
        expect(dropdown.value).toBe("False");
        expect(screen.queryByText(/solved is required./)).not.toBeInTheDocument();
      });

});