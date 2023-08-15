import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";

import { QueryClient, QueryClientProvider } from "react-query";
import RecommendationRequestForm from "main/components/RecommendationRequests/RecommendationRequestForm";
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("RecommendationRequestForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["RequesterEmail", "ProfessorEmail", "Explanation", "DateRequested", "DateNeeded", "Done"];
    const testId = "RecommendationRequestForm";

    test("renders correctly with no initialContents", async () => {
      render(
          <QueryClientProvider client={queryClient}>
              <Router>
                  <RecommendationRequestForm />
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
                <RecommendationRequestForm initialContents={recommendationRequestFixtures.oneRecommendationRequest} />
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
                <RecommendationRequestForm />
            </Router>
        </QueryClientProvider>
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
});



test("Correct Error messsages on bad input", async () => {

  render(
      <Router  >
          <RecommendationRequestForm />
      </Router>
  );
  await screen.findByTestId(`${testId}-requesterEmail`);
    const dateRequestedField = screen.getByTestId(`${testId}-dateRequested`);
    const dateNeededField = screen.getByTestId(`${testId}-dateNeeded`);
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

  fireEvent.change(dateNeededField, { target: { value: 'bad-input' } });
  fireEvent.change(dateRequestedField, { target: { value: 'bad-input' } });
  fireEvent.click(submitButton);

  await screen.findByText(/dateRequested must be in ISO format/);
  await screen.findByText(/dateNeeded must be in ISO format/);
});

test("Correct Error messsages on bad input (31char long for requesterEmail), and dateRequested in format", async () => {

  render(
      <Router  >
          <RecommendationRequestForm />
      </Router>
  );
  await screen.findByTestId(`${testId}-requesterEmail`);
  const requesterEmailField = screen.getByTestId(`${testId}-requesterEmail`);
  const dateRequestedField = screen.getByTestId(`${testId}-dateRequested`);
  const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

  fireEvent.change(requesterEmailField, { target: { value: 'a'.repeat(31) } });
  fireEvent.change(dateRequestedField, { target: { value: '2022-01-02T12:00' } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
});
  expect(screen.queryByText(/dateRequested must be in ISO format/)).not.toBeInTheDocument();

});

test("Correct Error messsages on bad input (31char long for professorEmail), and dateNeeded in format", async () => {

    render(
        <Router  >
            <RecommendationRequestForm />
        </Router>
    );
    await screen.findByTestId(`${testId}-done`);
    const professorEmailField = screen.getByTestId(`${testId}-professorEmail`);
    const dateNeededField = screen.getByTestId(`${testId}-dateNeeded`);
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");
  
    fireEvent.change(professorEmailField, { target: { value: 'a'.repeat(31) } });
    fireEvent.change(dateNeededField, { target: { value: '2022-01-02T12:00' } });
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
  });
    expect(screen.queryByText(/dateNeeded must be in ISO format/)).not.toBeInTheDocument();
  
  });
  


test("Correct input", async () => {

  render(
      <Router  >
          <RecommendationRequestForm />
      </Router>
  );
  await screen.findByTestId(`${testId}-explanation`);
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/requesterEmail is required/);
    expect(screen.getByText(/professorEmail is required/)).toBeInTheDocument();
    expect(screen.getByText(/dateRequested is required/)).toBeInTheDocument();
    expect(screen.getByText(/dateNeeded is required/)).toBeInTheDocument();
    expect(screen.getByText(/explanation is required/)).toBeInTheDocument();
    const doneField = screen.getByLabelText("Done");
    expect(doneField).toHaveValue("true");
  

    //expect(screen.queryByText(/QuarterYYYYQ must be in the format YYYYQ/)).not.toBeInTheDocument();
    //expect(screen.queryByText(/requestTime must be in ISO format/)).not.toBeInTheDocument();
});

test("change Done value", async () => {
    render(
        <QueryClientProvider client={queryClient}>
            <Router>
                <RecommendationRequestForm />
            </Router>
        </QueryClientProvider>
    );
    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    const doneField = screen.getByLabelText("Done");
    expect(doneField).toHaveValue("true");

    fireEvent.change(doneField, { target: { value: "false" } });
    
    fireEvent.click(submitButton);
    expect(doneField).toHaveValue("false");

    fireEvent.change(doneField, { target: { value: "true" } });

    fireEvent.click(submitButton);
    expect(doneField.value).toBe("true");


  });

});
